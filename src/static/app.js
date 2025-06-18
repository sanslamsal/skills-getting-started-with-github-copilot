document.addEventListener('DOMContentLoaded', function() {
    loadActivities();
    
    // Handle form submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        signupForActivity();
    });
});

async function loadActivities() {
    try {
        const response = await fetch('/activities');
        const activities = await response.json();
        
        displayActivities(activities);
        populateActivitySelect(activities);
    } catch (error) {
        console.error('Error loading activities:', error);
        document.getElementById('activities-list').innerHTML = '<p class="error">Error loading activities</p>';
    }
}

function displayActivities(activities) {
    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = '';
    
    Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        
        // Extract names from email addresses for display
        const participantNames = details.participants.map(email => {
            const name = email.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        });
        
        activityCard.innerHTML = `
            <h4>${name}</h4>
            <p><strong>Description:</strong> ${details.description}</p>
            <p><strong>Schedule:</strong> ${details.schedule}</p>
            <p><strong>Capacity:</strong> ${details.participants.length}/${details.max_participants} participants</p>
            
            <div class="participants-section">
                <h5 class="participants-title">
                    <span class="participants-icon">👥</span>
                    Participants (${details.participants.length})
                </h5>
                ${details.participants.length > 0 ? `
                    <ul class="participants-list">
                        ${participantNames.map(name => `
                            <li class="participant-item">
                                <span class="participant-avatar">
                                    ${name.charAt(0).toUpperCase()}
                                </span>
                                <span class="participant-name">${name}</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : '<p class="no-participants">No participants yet - be the first to join!</p>'}
            </div>
        `;
        
        activitiesList.appendChild(activityCard);
    });
}

function populateActivitySelect(activities) {
    const select = document.getElementById('activity');
    select.innerHTML = '<option value="">-- Select an activity --</option>';
    
    Object.keys(activities).forEach(activityName => {
        const option = document.createElement('option');
        option.value = activityName;
        option.textContent = activityName;
        select.appendChild(option);
    });
}

async function signupForActivity() {
    const email = document.getElementById('email').value;
    const activity = document.getElementById('activity').value;
    const messageDiv = document.getElementById('message');
    
    if (!email || !activity) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            document.getElementById('signup-form').reset();
            loadActivities(); // Refresh the activities list
        } else {
            showMessage(result.detail || 'Error signing up', 'error');
        }
    } catch (error) {
        console.error('Error signing up:', error);
        showMessage('Error signing up for activity', 'error');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}
