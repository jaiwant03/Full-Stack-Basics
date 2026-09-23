/**
 * ==========================================================================
 * TASKFLOW - SMART TASK MANAGEMENT
 * Pure Vanilla JavaScript (ES6+) • LocalStorage Persistence • Capacitor Ready
 * ==========================================================================
 */

(function () {
  'use strict';

  /* -------------------- 1. STORAGE & CONSTANTS -------------------- */
  const STORAGE_KEYS = {
    TASKS: 'taskflow_tasks',
    THEME: 'taskflow_theme',
    NOTIFICATIONS: 'taskflow_notifications'
  };

  // State Management
  let tasks = [];
  let notifications = [];
  let currentView = 'dashboard';
  let searchQuery = '';
  let statusFilter = 'all';
  let categoryFilter = 'all';
  let priorityFilter = 'all';
  let sortBy = 'newest';
  let taskPendingDeletionId = null;

  /* -------------------- 2. SAMPLE INITIAL DATA -------------------- */
  function getSampleTasks() {
    const today = new Date();
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const addDays = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return formatDate(d);
    };

    const todayStr = formatDate(today);
    const tomorrowStr = addDays(1);
    const nextWeekStr = addDays(4);
    const futureStr = addDays(7);

    return [
      {
        id: 'task_sample_1',
        title: 'Review Capstone Project Architecture',
        description: 'Prepare presentation slides and review system database schemas for review meeting.',
        category: 'Study',
        priority: 'High',
        status: 'In Progress',
        dueDate: todayStr,
        dueTime: '10:30',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_sample_2',
        title: 'Team Sync & Milestone Planning',
        description: 'Coordinate with development team on weekly deliverables and backlog prioritization.',
        category: 'Work',
        priority: 'Medium',
        status: 'Pending',
        dueDate: todayStr,
        dueTime: '14:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_sample_3',
        title: 'Evening 5km Jog & Stretch',
        description: 'Hit the outdoor running track and complete relaxation breathing routine.',
        category: 'Health',
        priority: 'Low',
        status: 'Pending',
        dueDate: todayStr,
        dueTime: '18:30',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_sample_4',
        title: 'Finalize Mobile WebView & Capacitor Config',
        description: 'Verify Android manifest, icon assets, and viewport styling for APK export.',
        category: 'Work',
        priority: 'High',
        status: 'Pending',
        dueDate: tomorrowStr,
        dueTime: '11:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_sample_5',
        title: 'Buy Groceries & Weekly Essentials',
        description: 'Organic vegetables, almond milk, whole grain bread, and dark roast coffee.',
        category: 'Shopping',
        priority: 'Medium',
        status: 'Pending',
        dueDate: nextWeekStr,
        dueTime: '17:00',
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_sample_6',
        title: 'Submit Lab Report Documentation',
        description: 'Completed writeup for web application experimentation with performance figures.',
        category: 'Study',
        priority: 'Medium',
        status: 'Completed',
        dueDate: todayStr,
        dueTime: '09:00',
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_sample_7',
        title: 'Schedule Annual Health Checkup',
        description: 'Book preventive appointment with community healthcare center.',
        category: 'Personal',
        priority: 'Low',
        status: 'Pending',
        dueDate: futureStr,
        dueTime: '15:00',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /* -------------------- 3. LOCAL STORAGE MANAGERS -------------------- */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        tasks = JSON.parse(stored);
      } else {
        tasks = getSampleTasks();
        saveTasks();
        addNotification('Welcome to TaskFlow! Sample tasks have been loaded.', 'info');
      }
    } catch (e) {
      console.error('Error loading tasks from LocalStorage', e);
      tasks = getSampleTasks();
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      updateAllUI();
    } catch (e) {
      console.error('Error saving tasks to LocalStorage', e);
      showToast('Error saving data. Storage might be full.', 'danger');
    }
  }

  function loadNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      notifications = stored ? JSON.parse(stored) : [];
    } catch (e) {
      notifications = [];
    }
  }

  function saveNotifications() {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      renderNotificationDrawer();
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  }

  function addNotification(message, type = 'info') {
    const item = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    notifications.unshift(item);
    if (notifications.length > 30) notifications.pop();
    saveNotifications();
    updateNotificationBadge();
  }

  /* -------------------- 4. THEME MANAGEMENT -------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    applyTheme(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
      });
    }
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    }
  }

  /* -------------------- 5. TASK CRUD OPERATIONS -------------------- */
  function createTask(taskData) {
    const newTask = {
      id: 'task_' + Date.now(),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      category: taskData.category || 'Other',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime || '',
      createdAt: new Date().toISOString(),
      completedAt: taskData.status === 'Completed' ? new Date().toISOString() : null
    };

    tasks.unshift(newTask);
    saveTasks();
    addNotification(`Task created: "${newTask.title}"`, 'success');
    showToast('Task created successfully!', 'success');
  }

  function updateTask(id, taskData) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    const oldStatus = tasks[index].status;
    const isNowCompleted = taskData.status === 'Completed';

    tasks[index] = {
      ...tasks[index],
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      category: taskData.category,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime || '',
      completedAt: isNowCompleted ? (tasks[index].completedAt || new Date().toISOString()) : null
    };

    saveTasks();
    addNotification(`Task updated: "${tasks[index].title}"`, 'info');
    showToast('Task updated successfully!', 'success');
  }

  function deleteTask(id) {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    addNotification(`Task deleted: "${taskToDelete.title}"`, 'danger');
    showToast('Task deleted successfully.', 'danger');
  }

  function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (task.status === 'Completed') {
      task.status = 'Pending';
      task.completedAt = null;
      addNotification(`Restored task: "${task.title}"`, 'info');
      showToast('Task moved back to Pending', 'info');
    } else {
      task.status = 'Completed';
      task.completedAt = new Date().toISOString();
      addNotification(`Completed: "${task.title}" 🎉`, 'success');
      showToast('Task completed! Great job! 🎉', 'success');
    }

    saveTasks();
  }

  function clearAllCompletedTasks() {
    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear.', 'warning');
      return;
    }

    tasks = tasks.filter(t => t.status !== 'Completed');
    saveTasks();
    addNotification(`Cleared ${completedCount} completed tasks`, 'warning');
    showToast(`Cleared ${completedCount} completed tasks`, 'info');
  }

  /* -------------------- 6. FILTER, SEARCH & SORT LOGIC -------------------- */
  function getFilteredAndSortedTasks(taskList) {
    return taskList
      .filter(task => {
        // Status Filter
        if (statusFilter !== 'all' && task.status !== statusFilter) {
          return false;
        }

        // Category Filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) {
          return false;
        }

        // Priority Filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }

        // Search Query (title, description, category)
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const matchCat = task.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'dueDate') {
          const dateA = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
          const dateB = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);
          return dateA - dateB;
        } else if (sortBy === 'priority') {
          const weight = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return (weight[b.priority] || 0) - (weight[a.priority] || 0);
        } else if (sortBy === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }

  /* -------------------- 7. DATE & TIME UTILITIES -------------------- */
  function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    try {
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  }

  function isOverdue(dueDate, dueTime, status) {
    if (status === 'Completed' || !dueDate) return false;
    const now = new Date();
    const target = new Date(`${dueDate}T${dueTime || '23:59'}`);
    return target < now;
  }

  /* -------------------- 8. UI RENDERING -------------------- */
  function updateAllUI() {
    renderStatistics();
    renderSidebarCounts();
    renderCurrentView();
    updateDateAndGreeting();
  }

  function renderCurrentView() {
    switch (currentView) {
      case 'dashboard':
        renderDashboardView();
        break;
      case 'all':
        renderAllTasksView();
        break;
      case 'today':
        renderTodayView();
        break;
      case 'upcoming':
        renderUpcomingView();
        break;
      case 'completed':
        renderCompletedView();
        break;
    }
  }

  /* Render Statistics */
  function renderStatistics() {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;

    document.getElementById('statTotalCount').textContent = total;
    document.getElementById('statPendingCount').textContent = pending;
    document.getElementById('statInProgressCount').textContent = inProgress;
    document.getElementById('statCompletedCount').textContent = completed;

    // Progress bar in sidebar
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressBar = document.getElementById('sidebarProgressBar');
    const progressPercent = document.getElementById('sidebarProgressPercent');
    const progressText = document.getElementById('sidebarProgressText');

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${percent}%`;
    if (progressText) progressText.textContent = `${completed} of ${total} tasks completed`;
  }

  /* Render Sidebar Badge Counts */
  function renderSidebarCounts() {
    const total = tasks.length;
    const todayStr = getTodayString();
    const todayCount = tasks.filter(t => t.dueDate === todayStr && t.status !== 'Completed').length;
    const upcomingCount = tasks.filter(t => t.dueDate > todayStr && t.status !== 'Completed').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;

    const elAll = document.getElementById('badgeAllCount');
    const elToday = document.getElementById('badgeTodayCount');
    const elUpcoming = document.getElementById('badgeUpcomingCount');
    const elCompleted = document.getElementById('badgeCompletedCount');

    if (elAll) elAll.textContent = total;
    if (elToday) elToday.textContent = todayCount;
    if (elUpcoming) elUpcoming.textContent = upcomingCount;
    if (elCompleted) elCompleted.textContent = completedCount;
  }

  /* Render Dashboard View */
  function renderDashboardView() {
    const todayStr = getTodayString();

    // 1. Today's focus (non-completed tasks due today)
    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
    const todayContainer = document.getElementById('dashTodayContainer');
    const todayCount = document.getElementById('dashTodayCount');

    if (todayCount) todayCount.textContent = todayTasks.length;

    if (todayContainer) {
      if (todayTasks.length === 0) {
        todayContainer.innerHTML = `
          <div class="empty-state" style="padding: 28px 16px;">
            <p class="empty-desc" style="margin-bottom: 0;">🎉 No tasks scheduled for today. You're free or all caught up!</p>
          </div>
        `;
      } else {
        todayContainer.innerHTML = todayTasks.slice(0, 3).map(task => renderTaskCardHTML(task)).join('');
      }
    }

    // 2. High priority or In Progress tasks
    const priorityTasks = tasks.filter(t => t.status !== 'Completed' && (t.priority === 'High' || t.status === 'In Progress'));
    const priorityContainer = document.getElementById('dashPriorityContainer');
    const priorityCount = document.getElementById('dashPriorityCount');

    if (priorityCount) priorityCount.textContent = priorityTasks.length;

    if (priorityContainer) {
      if (priorityTasks.length === 0) {
        priorityContainer.innerHTML = `
          <div class="empty-state" style="padding: 28px 16px;">
            <p class="empty-desc" style="margin-bottom: 0;">No high priority items requiring immediate attention.</p>
          </div>
        `;
      } else {
        priorityContainer.innerHTML = priorityTasks.slice(0, 3).map(task => renderTaskCardHTML(task)).join('');
      }
    }
  }

  /* Render All Tasks View */
  function renderAllTasksView() {
    // Update tab counts
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;

    document.getElementById('tabCountAll').textContent = total;
    document.getElementById('tabCountPending').textContent = pending;
    document.getElementById('tabCountInProgress').textContent = inProgress;
    document.getElementById('tabCountCompleted').textContent = completed;

    const filtered = getFilteredAndSortedTasks(tasks);
    const container = document.getElementById('allTasksGrid');

    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-illustration">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 class="empty-title">No matching tasks found</h3>
          <p class="empty-desc">Try clearing your filters or search keywords to view other tasks.</p>
          <button class="btn btn-outline btn-sm" id="emptyClearFiltersBtn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('emptyClearFiltersBtn');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    } else {
      container.innerHTML = filtered.map(task => renderTaskCardHTML(task)).join('');
    }
  }

  /* Render Today's Tasks View */
  function renderTodayView() {
    const todayStr = getTodayString();
    const todayTasks = tasks.filter(t => t.dueDate === todayStr);

    const emptyState = document.getElementById('todayEmptyState');
    const timeline = document.getElementById('todayTimelineContainer');
    const badge = document.getElementById('todayProgressBadge');

    const completedToday = todayTasks.filter(t => t.status === 'Completed').length;
    if (badge) badge.textContent = `${completedToday} / ${todayTasks.length} completed`;

    if (todayTasks.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (timeline) timeline.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (timeline) timeline.classList.remove('hidden');

    // Bucket into Morning, Afternoon, Evening based on dueTime
    const morningList = [];
    const afternoonList = [];
    const eveningList = [];

    todayTasks.forEach(task => {
      if (!task.dueTime) {
        afternoonList.push(task);
        return;
      }
      const hour = parseInt(task.dueTime.split(':')[0], 10);
      if (hour < 12) {
        morningList.push(task);
      } else if (hour < 17) {
        afternoonList.push(task);
      } else {
        eveningList.push(task);
      }
    });

    document.getElementById('countMorning').textContent = morningList.length;
    document.getElementById('countAfternoon').textContent = afternoonList.length;
    document.getElementById('countEvening').textContent = eveningList.length;

    const cardsMorning = document.getElementById('cardsMorning');
    const cardsAfternoon = document.getElementById('cardsAfternoon');
    const cardsEvening = document.getElementById('cardsEvening');

    cardsMorning.innerHTML = morningList.length > 0 
      ? morningList.map(renderTaskCardHTML).join('') 
      : '<p class="empty-desc" style="grid-column: 1 / -1; margin: 0; padding: 10px 0; font-size: 0.85rem;">No tasks scheduled for morning.</p>';

    cardsAfternoon.innerHTML = afternoonList.length > 0 
      ? afternoonList.map(renderTaskCardHTML).join('') 
      : '<p class="empty-desc" style="grid-column: 1 / -1; margin: 0; padding: 10px 0; font-size: 0.85rem;">No tasks scheduled for afternoon.</p>';

    cardsEvening.innerHTML = eveningList.length > 0 
      ? eveningList.map(renderTaskCardHTML).join('') 
      : '<p class="empty-desc" style="grid-column: 1 / -1; margin: 0; padding: 10px 0; font-size: 0.85rem;">No tasks scheduled for evening.</p>';
  }

  /* Render Upcoming Tasks View */
  function renderUpcomingView() {
    const todayStr = getTodayString();
    const upcomingTasks = tasks
      .filter(t => t.dueDate > todayStr && t.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const totalBadge = document.getElementById('upcomingTotalBadge');
    if (totalBadge) totalBadge.textContent = `${upcomingTasks.length} tasks`;

    const emptyState = document.getElementById('upcomingEmptyState');
    const container = document.getElementById('upcomingTimelineContainer');

    if (upcomingTasks.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (container) container.classList.add('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (container) container.classList.remove('hidden');

    // Group by Date
    const grouped = {};
    upcomingTasks.forEach(task => {
      if (!grouped[task.dueDate]) {
        grouped[task.dueDate] = [];
      }
      grouped[task.dueDate].push(task);
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let html = '';
    Object.keys(grouped).forEach(dateKey => {
      const isTomorrow = dateKey === tomorrowStr;
      const displayTitle = isTomorrow ? 'Tomorrow' : formatDisplayDate(dateKey);
      const count = grouped[dateKey].length;

      html += `
        <div class="upcoming-date-section">
          <div class="upcoming-date-header">
            <h3 class="upcoming-date-title">
              📅 ${displayTitle}
            </h3>
            <span class="upcoming-date-badge">${count} ${count === 1 ? 'task' : 'tasks'}</span>
          </div>
          <div class="task-cards-grid">
            ${grouped[dateKey].map(renderTaskCardHTML).join('')}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* Render Completed Tasks View */
  function renderCompletedView() {
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const container = document.getElementById('completedTasksGrid');
    const emptyState = document.getElementById('completedEmptyState');

    if (!container) return;

    if (completedTasks.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      container.innerHTML = '';
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      container.innerHTML = completedTasks.map(task => renderTaskCardHTML(task, true)).join('');
    }
  }

  /* Generate Single Task Card HTML */
  function renderTaskCardHTML(task, isCompletedView = false) {
    const isDone = task.status === 'Completed';
    const overdue = isOverdue(task.dueDate, task.dueTime, task.status);

    // Category emoji helper
    const catIcons = {
      'Work': '💼',
      'Study': '📚',
      'Personal': '👤',
      'Health': '🧘',
      'Shopping': '🛒',
      'Other': '📌'
    };

    const catIcon = catIcons[task.category] || '📌';
    const priorityClass = task.priority ? task.priority.toLowerCase() : 'medium';
    const statusClass = task.status ? task.status.toLowerCase().replace(' ', '') : 'pending';

    const formattedDate = formatDisplayDate(task.dueDate);
    const formattedTime = task.dueTime ? formatTime(task.dueTime) : '';

    return `
      <div class="task-card ${isDone ? 'is-completed' : ''}" data-task-id="${task.id}">
        <div class="task-card-header">
          <div class="task-title-wrap">
            <button class="task-check-btn" onclick="window.TaskFlowApp.toggleTask('${task.id}')" aria-label="${isDone ? 'Mark Incomplete' : 'Mark Completed'}" title="${isDone ? 'Mark Pending' : 'Mark Complete'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <div>
              <h4 class="task-title">${escapeHTML(task.title)}</h4>
              ${task.description ? `<p class="task-desc">${escapeHTML(task.description)}</p>` : ''}
            </div>
          </div>
        </div>

        <div class="task-badges">
          <span class="badge badge-category">${catIcon} ${escapeHTML(task.category)}</span>
          <span class="badge badge-priority ${priorityClass}">● ${escapeHTML(task.priority)}</span>
          <span class="badge badge-status ${statusClass}">${escapeHTML(task.status)}</span>
        </div>

        <div class="task-card-footer">
          <div class="task-due-info ${overdue ? 'overdue' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${formattedDate}${formattedTime ? ` • ${formattedTime}` : ''}${overdue ? ' (Overdue)' : ''}</span>
          </div>

          <div class="task-actions">
            ${isCompletedView ? `
              <button class="card-action-btn" onclick="window.TaskFlowApp.toggleTask('${task.id}')" title="Restore Task">
                ↺ Restore
              </button>
            ` : `
              <button class="card-action-btn edit-btn" onclick="window.TaskFlowApp.openEditModal('${task.id}')" title="Edit Task">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Edit
              </button>
            `}
            <button class="card-action-btn delete-btn" onclick="window.TaskFlowApp.promptDeleteTask('${task.id}')" title="Delete Task">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* -------------------- 9. VIEW SWITCHING & ROUTING -------------------- */
  function switchView(viewName) {
    currentView = viewName;

    // Toggle active view container
    const viewSections = document.querySelectorAll('.view-section');
    viewSections.forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(
      viewName === 'dashboard' ? 'viewDashboard' :
      viewName === 'all' ? 'viewAll' :
      viewName === 'today' ? 'viewToday' :
      viewName === 'upcoming' ? 'viewUpcoming' : 'viewCompleted'
    );

    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Toggle Sidebar active buttons
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Toggle Mobile Bottom Nav buttons
    document.querySelectorAll('.mobile-bottom-nav .bottom-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Render corresponding view data
    renderCurrentView();

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* -------------------- 10. NOTIFICATION DRAWER & BADGE -------------------- */
  function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;

    if (notifications.length > 0) {
      badge.classList.add('active');
    } else {
      badge.classList.remove('active');
    }
  }

  function renderNotificationDrawer() {
    const list = document.getElementById('notificationList');
    const countBadge = document.getElementById('drawerCount');

    if (countBadge) countBadge.textContent = notifications.length;

    if (!list) return;

    if (notifications.length === 0) {
      list.innerHTML = `<div class="drawer-empty-text">No recent notifications.</div>`;
      return;
    }

    list.innerHTML = notifications.map(notif => `
      <div class="notification-item">
        <div class="notification-item-icon ${notif.type || 'info'}">
          ${notif.type === 'success' ? '✓' : notif.type === 'danger' ? '✕' : notif.type === 'warning' ? '!' : 'ℹ'}
        </div>
        <div class="notification-item-body">
          <div class="notification-text">${escapeHTML(notif.message)}</div>
          <div class="notification-time">${notif.time} • ${notif.date}</div>
        </div>
      </div>
    `).join('');
  }

  function toggleNotificationDrawer(show) {
    const drawerBackdrop = document.getElementById('notificationDrawerBackdrop');
    if (!drawerBackdrop) return;

    if (show) {
      renderNotificationDrawer();
      drawerBackdrop.classList.remove('hidden');
      const badge = document.getElementById('notificationBadge');
      if (badge) badge.classList.remove('active');
    } else {
      drawerBackdrop.classList.add('hidden');
    }
  }

  /* -------------------- 11. TOAST NOTIFICATIONS -------------------- */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSymbol = type === 'success' ? '✓' : type === 'danger' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';

    toast.innerHTML = `
      <div class="toast-icon">${iconSymbol}</div>
      <div class="toast-message">${escapeHTML(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 3200);
  }

  /* -------------------- 12. MODAL CONTROLLERS -------------------- */
  function openTaskModal(mode = 'create', task = null) {
    const modalBackdrop = document.getElementById('taskModalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('saveTaskSubmitBtn');
    const form = document.getElementById('taskForm');

    // Reset validation errors
    document.getElementById('titleError').textContent = '';
    document.getElementById('dateError').textContent = '';
    document.getElementById('taskTitleInput').classList.remove('is-invalid');
    document.getElementById('taskDueDateInput').classList.remove('is-invalid');

    form.reset();

    if (mode === 'edit' && task) {
      modalTitle.textContent = 'Edit Task';
      submitBtn.textContent = 'Update Task';
      document.getElementById('taskIdInput').value = task.id;
      document.getElementById('taskTitleInput').value = task.title;
      document.getElementById('taskDescInput').value = task.description || '';
      document.getElementById('taskCategorySelect').value = task.category || 'Other';
      document.getElementById('taskPrioritySelect').value = task.priority || 'Medium';
      document.getElementById('taskDueDateInput').value = task.dueDate || getTodayString();
      document.getElementById('taskDueTimeInput').value = task.dueTime || '';
      document.getElementById('taskStatusSelect').value = task.status || 'Pending';
    } else {
      modalTitle.textContent = 'Create New Task';
      submitBtn.textContent = 'Create Task';
      document.getElementById('taskIdInput').value = '';
      document.getElementById('taskDueDateInput').value = getTodayString();
      document.getElementById('taskCategorySelect').value = 'Study';
      document.getElementById('taskPrioritySelect').value = 'Medium';
      document.getElementById('taskStatusSelect').value = 'Pending';
    }

    modalBackdrop.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('taskTitleInput').focus();
    }, 50);
  }

  function closeTaskModal() {
    const modalBackdrop = document.getElementById('taskModalBackdrop');
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
  }

  function handleTaskFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('taskIdInput').value;
    const title = document.getElementById('taskTitleInput').value.trim();
    const description = document.getElementById('taskDescInput').value.trim();
    const category = document.getElementById('taskCategorySelect').value;
    const priority = document.getElementById('taskPrioritySelect').value;
    const dueDate = document.getElementById('taskDueDateInput').value;
    const dueTime = document.getElementById('taskDueTimeInput').value;
    const status = document.getElementById('taskStatusSelect').value;

    let hasError = false;

    // Validate Title
    if (!title) {
      document.getElementById('titleError').textContent = 'Please enter a task title.';
      document.getElementById('taskTitleInput').classList.add('is-invalid');
      hasError = true;
    } else {
      document.getElementById('titleError').textContent = '';
      document.getElementById('taskTitleInput').classList.remove('is-invalid');
    }

    // Validate Date
    if (!dueDate) {
      document.getElementById('dateError').textContent = 'Please select a valid due date.';
      document.getElementById('taskDueDateInput').classList.add('is-invalid');
      hasError = true;
    } else {
      document.getElementById('dateError').textContent = '';
      document.getElementById('taskDueDateInput').classList.remove('is-invalid');
    }

    if (hasError) return;

    const taskPayload = {
      title,
      description,
      category,
      priority,
      dueDate,
      dueTime,
      status
    };

    if (id) {
      updateTask(id, taskPayload);
    } else {
      createTask(taskPayload);
    }

    closeTaskModal();
  }

  function promptDeleteConfirmation(id) {
    taskPendingDeletionId = id;
    const modal = document.getElementById('deleteConfirmModalBackdrop');
    if (modal) modal.classList.remove('hidden');
  }

  function closeDeleteModal() {
    taskPendingDeletionId = null;
    const modal = document.getElementById('deleteConfirmModalBackdrop');
    if (modal) modal.classList.add('hidden');
  }

  function confirmDelete() {
    if (taskPendingDeletionId) {
      deleteTask(taskPendingDeletionId);
    }
    closeDeleteModal();
  }

  /* -------------------- 13. MOBILE DRAWER -------------------- */
  function openMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  /* -------------------- 14. GREETING & DATE -------------------- */
  function updateDateAndGreeting() {
    const now = new Date();
    const hour = now.getHours();

    let greeting = 'Good Morning 👋';
    if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon ☀️';
    } else if (hour >= 17) {
      greeting = 'Good Evening 🌙';
    }

    const headingEl = document.getElementById('greetingHeading');
    const mobileHeadingEl = document.getElementById('mobileGreetingTitle');
    if (headingEl) headingEl.textContent = greeting;
    if (mobileHeadingEl) mobileHeadingEl.textContent = greeting;

    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateFormatted = now.toLocaleDateString('en-US', options);

    const greetingDate = document.getElementById('greetingDate');
    const mobileGreetingDate = document.getElementById('mobileGreetingDate');
    const todaySub = document.getElementById('todayViewDateSubtitle');

    if (greetingDate) greetingDate.textContent = `Today is ${dateFormatted}`;
    if (mobileGreetingDate) mobileGreetingDate.textContent = dateFormatted;
    if (todaySub) todaySub.textContent = `Scheduled tasks for ${dateFormatted}`;
  }

  function resetFilters() {
    statusFilter = 'all';
    categoryFilter = 'all';
    priorityFilter = 'all';
    searchQuery = '';

    const searchInput = document.getElementById('globalSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const catSelect = document.getElementById('categoryFilter');
    const prioSelect = document.getElementById('priorityFilter');
    const sortSelect = document.getElementById('sortTasksBy');

    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
    if (catSelect) catSelect.value = 'all';
    if (prioSelect) prioSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'newest';

    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-status') === 'all');
    });

    renderCurrentView();
  }

  /* -------------------- 15. INITIALIZATION & LISTENERS -------------------- */
  function setupEventListeners() {
    // Nav Click Listeners (Sidebar and Bottom Nav)
    document.querySelectorAll('[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        const view = item.getAttribute('data-view');
        if (view) switchView(view);
      });
    });

    // Mobile Sidebar controls
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    // Add Task Buttons (Header, Mobile FAB, and view empty buttons)
    const openAddBtn = document.getElementById('openAddTaskBtn');
    const fabBtn = document.getElementById('mobileFabAddTask');
    const todayAddEmpty = document.getElementById('todayAddEmptyBtn');
    const upcomingAddEmpty = document.getElementById('upcomingAddEmptyBtn');

    if (openAddBtn) openAddBtn.addEventListener('click', () => openTaskModal('create'));
    if (fabBtn) fabBtn.addEventListener('click', () => openTaskModal('create'));
    if (todayAddEmpty) todayAddEmpty.addEventListener('click', () => openTaskModal('create'));
    if (upcomingAddEmpty) upcomingAddEmpty.addEventListener('click', () => openTaskModal('create'));

    // Modal Close and Submit
    const closeModalBtn = document.getElementById('closeTaskModalBtn');
    const cancelModalBtn = document.getElementById('cancelTaskModalBtn');
    const taskModalBackdrop = document.getElementById('taskModalBackdrop');
    const taskForm = document.getElementById('taskForm');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeTaskModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeTaskModal);
    if (taskForm) taskForm.addEventListener('submit', handleTaskFormSubmit);

    // Close modal on outside backdrop click
    if (taskModalBackdrop) {
      taskModalBackdrop.addEventListener('click', (e) => {
        if (e.target === taskModalBackdrop) closeTaskModal();
      });
    }

    // Delete confirmation modal listeners
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteConfirmBackdrop = document.getElementById('deleteConfirmModalBackdrop');

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmDelete);
    if (deleteConfirmBackdrop) {
      deleteConfirmBackdrop.addEventListener('click', (e) => {
        if (e.target === deleteConfirmBackdrop) closeDeleteModal();
      });
    }

    // Clear all completed button
    const clearAllCompletedBtn = document.getElementById('clearAllCompletedBtn');
    if (clearAllCompletedBtn) {
      clearAllCompletedBtn.addEventListener('click', clearAllCompletedTasks);
    }

    // Notifications Drawer listeners
    const notifBellBtn = document.getElementById('notificationBellBtn');
    const closeDrawerBtn = document.getElementById('closeNotificationDrawerBtn');
    const drawerBackdrop = document.getElementById('notificationDrawerBackdrop');
    const clearAllNotifsBtn = document.getElementById('clearAllNotificationsBtn');

    if (notifBellBtn) notifBellBtn.addEventListener('click', () => toggleNotificationDrawer(true));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => toggleNotificationDrawer(false));
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === drawerBackdrop) toggleNotificationDrawer(false);
      });
    }
    if (clearAllNotifsBtn) {
      clearAllNotifsBtn.addEventListener('click', () => {
        notifications = [];
        saveNotifications();
        showToast('All notifications cleared', 'info');
      });
    }

    // Search Input
    const searchInput = document.getElementById('globalSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
        }
        if (currentView !== 'all') {
          switchView('all');
        } else {
          renderAllTasksView();
        }
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderAllTasksView();
      });
    }

    // Filter Tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        statusFilter = tab.getAttribute('data-status');
        renderAllTasksView();
      });
    });

    // Secondary Dropdowns: Category, Priority, Sort
    const catFilter = document.getElementById('categoryFilter');
    const prioFilter = document.getElementById('priorityFilter');
    const sortSelect = document.getElementById('sortTasksBy');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    if (catFilter) {
      catFilter.addEventListener('change', (e) => {
        categoryFilter = e.target.value;
        renderAllTasksView();
      });
    }

    if (prioFilter) {
      prioFilter.addEventListener('change', (e) => {
        priorityFilter = e.target.value;
        renderAllTasksView();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderAllTasksView();
      });
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetFilters);
    }

    // Stat cards click -> jump to filtered All view
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('click', () => {
        const filterType = card.getAttribute('data-stat-filter');
        statusFilter = filterType;
        filterTabs.forEach(tab => {
          tab.classList.toggle('active', tab.getAttribute('data-status') === filterType);
        });
        switchView('all');
      });
    });

    // Keyboard Shortcuts: ESC closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTaskModal();
        closeDeleteModal();
        toggleNotificationDrawer(false);
        closeMobileSidebar();
      }
    });
  }

  /* -------------------- 16. GLOBAL API (For card inline buttons) -------------------- */
  window.TaskFlowApp = {
    toggleTask: function (id) {
      toggleTaskStatus(id);
    },
    openEditModal: function (id) {
      const task = tasks.find(t => t.id === id);
      if (task) openTaskModal('edit', task);
    },
    promptDeleteTask: function (id) {
      promptDeleteConfirmation(id);
    }
  };

  /* -------------------- 17. APP ENTRYPOINT -------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadTasks();
    loadNotifications();
    setupEventListeners();
    updateAllUI();
  });

})();
