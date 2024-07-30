function createTask() {
    return {
      title: [],
      description: [],
      assignedTo: [],
      dueDate: [],
      prio: {
        urgent: false,
        medium: false,
        low: false,
      },
      category: [],
      subtasks: [],
    };
  }