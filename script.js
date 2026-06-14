document.addEventListener('DOMContentLoaded', () => {
  // --- Tab Navigation Setup ---
  const menuItems = document.querySelectorAll('.menu-item');
  const sections = document.querySelectorAll('.report-section');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active from all items
      menuItems.forEach(mi => mi.classList.remove('active'));
      // Add active to current
      item.classList.add('active');

      // Hide all sections
      sections.forEach(sec => sec.classList.remove('active-tab-content'));
      
      // Show targeted section
      const tabId = item.getAttribute('data-tab');
      const targetSection = document.getElementById(`${tabId}-section`);
      if (targetSection) {
        targetSection.classList.add('active-tab-content');
      }

      // Smooth scroll back to top of main content
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // --- Timeline Monthly Filter ---
  const monthButtons = document.querySelectorAll('.month-btn');
  const timelineRows = document.querySelectorAll('#timeline-table-body tr');

  monthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      monthButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedMonth = btn.getAttribute('data-month');

      // Filter rows
      timelineRows.forEach(row => {
        const rowMonthAttr = row.getAttribute('data-month');
        
        if (selectedMonth === 'all') {
          row.style.display = '';
        } else {
          // If the row month attribute contains the selected month (handles ranges like "1-2" when filtering for "1" or "2")
          if (rowMonthAttr && rowMonthAttr.split('-').map(s => s.trim()).includes(selectedMonth)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  });
});

// --- Gap Analysis Simulation ---
function updateGapStatus() {
  const itemIndex = parseInt(document.getElementById('gap-select-item').value);
  const selectedStatus = document.getElementById('gap-select-status').value;
  const tableRows = document.querySelectorAll('#gap-table-body tr');
  
  if (itemIndex >= 0 && itemIndex < tableRows.length) {
    const targetRow = tableRows[itemIndex];
    const statusCell = targetRow.cells[2]; // Index 2 is the Status cell
    
    // Clear old status
    statusCell.innerHTML = '';
    
    // Create new badge
    const badge = document.createElement('span');
    badge.className = 'status-badge';
    
    if (selectedStatus === 'complete') {
      badge.classList.add('status-complete');
      badge.textContent = 'ดำเนินการเสร็จสิ้น';
    } else if (selectedStatus === 'partial') {
      badge.classList.add('status-partial');
      badge.textContent = 'กำลังดำเนินการ';
    } else {
      badge.classList.add('status-missing');
      badge.textContent = 'ยังไม่ได้ดำเนินการ';
    }
    
    statusCell.appendChild(badge);
    
    // Recalculate progress for the dashboard cards
    recalculateProgress();
  }
}

function recalculateProgress() {
  const tableRows = document.querySelectorAll('#gap-table-body tr');
  let completedCount = 0;
  let partialCount = 0;
  let missingCount = 0;
  
  tableRows.forEach(row => {
    const badge = row.querySelector('.status-badge');
    if (badge) {
      if (badge.classList.contains('status-complete')) {
        completedCount++;
      } else if (badge.classList.contains('status-partial')) {
        partialCount++;
      } else if (badge.classList.contains('status-missing')) {
        missingCount++;
      }
    }
  });
  
  const total = tableRows.length;
  const completedPercent = Math.round((completedCount / total) * 100);
  const partialPercent = Math.round((partialCount / total) * 100);
  const missingPercent = Math.round((missingCount / total) * 100);
  
  // Update UI progress items on Section 1
  const progressItems = document.querySelectorAll('.status-summary-item .number');
  if (progressItems.length >= 3) {
    // We update item 1 to show completed %
    progressItems[0].textContent = `${completedPercent}%`;
    progressItems[0].className = 'number ' + (completedPercent === 100 ? 'text-success' : '');
    
    // Update item 2 for In Progress %
    progressItems[1].textContent = `${partialPercent}%`;
    progressItems[1].className = 'number ' + (partialPercent > 0 ? 'text-warning' : '');
    
    // Update item 3 for Not Started %
    progressItems[2].textContent = `${missingPercent}%`;
    progressItems[2].className = 'number ' + (missingPercent > 50 ? 'text-danger' : '');
  }
}
