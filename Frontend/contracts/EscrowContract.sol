// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract EscrowContract {
    
    enum TaskStatus { 
        Created,        // Task created, waiting for doer
        Accepted,       // Doer accepted the task
        Submitted,      // Doer submitted the work
        Completed,      // Creator approved, payment released
        Disputed,       // Dispute raised
        Resolved,       // Admin resolved the dispute
        Cancelled       // Task cancelled
    }
    
    struct Task {
        uint256 id;
        string name;
        string description;
        address creator;
        address doer;
        address stablecoinToken; // USDC or other stablecoin
        uint256 amount; // Amount in stablecoin
        uint256 deadline;
        TaskStatus status;
        bool disputeRaisedByDoer;
        bool disputeRaisedByCreator;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 submittedAt;
        string originalCurrency; // "ETH", "USDC", etc.
        uint256 originalAmount; // Original amount before swap
    }
    
    address public admin;
    uint256 public taskCounter;
    uint256 public platformFeePercent = 2; // 2% platform fee
    
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public creatorTasks;
    mapping(address => uint256[]) public doerTasks;
    
    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        string name,
        uint256 amount,
        string currency
    );
    
    event TaskAccepted(uint256 indexed taskId, address indexed doer);
    event TaskSubmitted(uint256 indexed taskId, address indexed doer);
    event TaskCompleted(uint256 indexed taskId, address indexed doer, uint256 amount);
    event TaskRejected(uint256 indexed taskId, string reason);
    event DisputeRaised(uint256 indexed taskId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed taskId, address indexed winner, uint256 amount);
    event TaskCancelled(uint256 indexed taskId);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier onlyCreator(uint256 _taskId) {
        require(tasks[_taskId].creator == msg.sender, "Only creator can call this");
        _;
    }
    
    modifier onlyDoer(uint256 _taskId) {
        require(tasks[_taskId].doer == msg.sender, "Only doer can call this");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        taskCounter = 0;
    }
    
    function createTask(
        string memory _name,
        string memory _description,
        address _stablecoinToken,
        uint256 _amount,
        uint256 _deadline,
        string memory _originalCurrency,
        uint256 _originalAmount
    ) external returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        // Transfer stablecoin from creator to contract
        IERC20 token = IERC20(_stablecoinToken);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );
        
        taskCounter++;
        
        Task memory newTask = Task({
            id: taskCounter,
            name: _name,
            description: _description,
            creator: msg.sender,
            doer: address(0),
            stablecoinToken: _stablecoinToken,
            amount: _amount,
            deadline: _deadline,
            status: TaskStatus.Created,
            disputeRaisedByDoer: false,
            disputeRaisedByCreator: false,
            createdAt: block.timestamp,
            acceptedAt: 0,
            submittedAt: 0,
            originalCurrency: _originalCurrency,
            originalAmount: _originalAmount
        });
        
        tasks[taskCounter] = newTask;
        creatorTasks[msg.sender].push(taskCounter);
        
        emit TaskCreated(taskCounter, msg.sender, _name, _amount, _originalCurrency);
        
        return taskCounter;
    }
    
    function acceptTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Created, "Task not available");
        require(task.creator != msg.sender, "Creator cannot accept own task");
        require(block.timestamp < task.deadline, "Task deadline passed");
        
        task.doer = msg.sender;
        task.status = TaskStatus.Accepted;
        task.acceptedAt = block.timestamp;
        
        doerTasks[msg.sender].push(_taskId);
        
        emit TaskAccepted(_taskId, msg.sender);
    }
    
    function submitTask(uint256 _taskId) external onlyDoer(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Accepted, "Task not in accepted state");
        require(block.timestamp < task.deadline, "Task deadline passed");
        
        task.status = TaskStatus.Submitted;
        task.submittedAt = block.timestamp;
        
        emit TaskSubmitted(_taskId, msg.sender);
    }
    
    function approveTask(uint256 _taskId) external onlyCreator(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Submitted, "Task not submitted");
        
        task.status = TaskStatus.Completed;
        
        // Calculate platform fee
        uint256 platformFee = (task.amount * platformFeePercent) / 100;
        uint256 doerAmount = task.amount - platformFee;
        
        // Transfer to doer
        IERC20 token = IERC20(task.stablecoinToken);
        require(token.transfer(task.doer, doerAmount), "Transfer to doer failed");
        
        // Transfer platform fee to admin
        require(token.transfer(admin, platformFee), "Transfer to admin failed");
        
        emit TaskCompleted(_taskId, task.doer, doerAmount);
    }
    
    function rejectTask(uint256 _taskId, string memory _reason) external onlyCreator(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Submitted, "Task not submitted");
        
        task.status = TaskStatus.Accepted; // Reset to accepted so doer can resubmit
        
        emit TaskRejected(_taskId, _reason);
    }
    
    function raiseDisputeByDoer(uint256 _taskId) external onlyDoer(_taskId) {
        Task storage task = tasks[_taskId];
        require(
            task.status == TaskStatus.Submitted || task.status == TaskStatus.Accepted,
            "Invalid task status for dispute"
        );
        require(!task.disputeRaisedByDoer, "Dispute already raised by doer");
        
        task.status = TaskStatus.Disputed;
        task.disputeRaisedByDoer = true;
        
        emit DisputeRaised(_taskId, msg.sender);
    }
    
    function raiseDisputeByCreator(uint256 _taskId) external onlyCreator(_taskId) {
        Task storage task = tasks[_taskId];
        require(
            task.status == TaskStatus.Submitted || task.status == TaskStatus.Accepted,
            "Invalid task status for dispute"
        );
        require(!task.disputeRaisedByCreator, "Dispute already raised by creator");
        
        task.status = TaskStatus.Disputed;
        task.disputeRaisedByCreator = true;
        
        emit DisputeRaised(_taskId, msg.sender);
    }
    
    function resolveDispute(uint256 _taskId, bool _favorDoer) external onlyAdmin {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Disputed, "Task not in dispute");
        
        task.status = TaskStatus.Resolved;
        
        IERC20 token = IERC20(task.stablecoinToken);
        
        if (_favorDoer) {
            // Pay doer
            uint256 platformFee = (task.amount * platformFeePercent) / 100;
            uint256 doerAmount = task.amount - platformFee;
            
            require(token.transfer(task.doer, doerAmount), "Transfer to doer failed");
            require(token.transfer(admin, platformFee), "Transfer to admin failed");
            
            emit DisputeResolved(_taskId, task.doer, doerAmount);
        } else {
            // Refund creator (minus a small dispute fee)
            uint256 disputeFee = (task.amount * 5) / 100; // 5% dispute fee
            uint256 refundAmount = task.amount - disputeFee;
            
            require(token.transfer(task.creator, refundAmount), "Refund to creator failed");
            require(token.transfer(admin, disputeFee), "Transfer dispute fee failed");
            
            emit DisputeResolved(_taskId, task.creator, refundAmount);
        }
    }
    
    function cancelTask(uint256 _taskId) external onlyCreator(_taskId) {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Created, "Can only cancel unclaimed tasks");
        
        task.status = TaskStatus.Cancelled;
        
        // Refund to creator
        IERC20 token = IERC20(task.stablecoinToken);
        require(token.transfer(task.creator, task.amount), "Refund failed");
        
        emit TaskCancelled(_taskId);
    }
    
    function getTask(uint256 _taskId) external view returns (Task memory) {
        return tasks[_taskId];
    }
    
    function getCreatorTasks(address _creator) external view returns (uint256[] memory) {
        return creatorTasks[_creator];
    }
    
    function getDoerTasks(address _doer) external view returns (uint256[] memory) {
        return doerTasks[_doer];
    }
    
    function getAllTasks() external view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](taskCounter);
        for (uint256 i = 1; i <= taskCounter; i++) {
            allTasks[i - 1] = tasks[i];
        }
        return allTasks;
    }
    
    function updateAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
    
    function updatePlatformFee(uint256 _newFeePercent) external onlyAdmin {
        require(_newFeePercent <= 10, "Fee too high"); // Max 10%
        platformFeePercent = _newFeePercent;
    }
}