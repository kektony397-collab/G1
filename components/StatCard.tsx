
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon }) => {
  return (
    <div className="bg-base-200/50 backdrop-blur-sm p-4 rounded-2xl flex items-center space-x-4 shadow-lg border border-base-300/50">
      <div className="bg-brand-primary/20 text-brand-primary p-3 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm text-text-secondary font-medium">{label}</p>
        <p className="text-2xl font-bold text-text-primary">
          {value} <span className="text-lg font-normal text-text-secondary">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default StatCard;
