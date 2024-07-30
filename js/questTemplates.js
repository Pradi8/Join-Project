let guestTasks = {
  toDo: [
    {
      title: ["Task 1"],
      description: ["Beschreibung von Task 1"],
      assignedTo: ["MA", "HL", "KP"],
      dueDate: ["2024-08-01"],
      prio: {
        urgent: false,
        medium: true,
        low: false
      },
      category: ["User Story"],
      subtasks: ["Subtask 1"]
    },
    {
      title: ["Task 2"],
      description: ["Beschreibung von Task 1"],
      assignedTo: ["UA", "TS"],
      dueDate: ["2024-08-31"],
      prio: {
        urgent: true,
        medium: false,
        low: false
      },
      category: ["Technical Task"],
      subtasks: ["Subtask 1"]
    }
  ],
  inProgress: [
    {
      title: ["Progess"],
      description: ["Beschreibung von Task 1"],
      assignedTo: ["OP"],
      dueDate: ["2024-10-11"],
      prio: {
        urgent: true,
        medium: false,
        low: false
      },
      category: ["Technical Task"],
      subtasks: ["Subtask 1"]
    }
  ],
  awaitFeedback: [
    {
      title: ["Feedback"],
      description: ["Beschreibung von Task 1"],
      assignedTo: ["LA"],
      dueDate: ["2025-01-01"],
      prio: {
        urgent: true,
        medium: false,
        low: false
      },
      category: ["User Story"],
      subtasks: [""]
    }
  ],
  done: [
    {
      title: ["Done"],
      description: ["Beschreibung von Task 1"],
      assignedTo: ["User A"],
      dueDate: [""],
      prio: {
        urgent: true,
        medium: false,
        low: false
      },
      category: ["Kategorie A"],
      subtasks: ["Subtask 1"]
    }
  ]
};