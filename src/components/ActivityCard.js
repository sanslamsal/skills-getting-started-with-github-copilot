import React from 'react';
import './ActivityCard.css';

const ActivityCard = ({ activity }) => {
  return (
    <div className="activity-card">
      <div className="activity-details">
        <h2 className="activity-title">{activity.title}</h2>
        <p className="activity-description">{activity.description}</p>
        <span className="activity-date">{activity.date}</span>
      </div>

      {/* Participants Section */}
      {activity.participants && activity.participants.length > 0 && (
        <div className="participants-section">
          <h4 className="participants-title">
            <span className="participants-icon">👥</span>
            Participants ({activity.participants.length})
          </h4>
          <ul className="participants-list">
            {activity.participants.map((participant, index) => (
              <li key={index} className="participant-item">
                <span className="participant-avatar">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
                <span className="participant-name">{participant.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;