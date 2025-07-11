import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react'; // fallback icon

const StatCard = ({ title, value, color = '#2563EB', icon: Icon = Activity, isDarkMode }) => {
  const styles = useMemo(() => ({
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#1F2937',
    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
    labelColor: '#6B7280'
  }), [isDarkMode]);

  return (
    <div
      className="p-6 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-[1.02]"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        border: `1px solid ${styles.borderColor}`
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium" style={{ color: styles.labelColor }}>
          {title}
        </h3>
        {Icon && <Icon className="w-5 h-5" style={{ color: styles.labelColor }} />}
      </div>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  icon: PropTypes.elementType,
  isDarkMode: PropTypes.bool
};

export default React.memo(StatCard);
