import React from 'react';
import { Trip } from '../types';
import { generateTripPdf } from '../services/pdfGenerator';
import { DownloadIcon, TrashIcon, DistanceIcon, TimeIcon, AreaIcon, MapPinIcon } from './icons';

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
      onDelete(trip.id);
    }
  };

  return (
    <div className="bg-base-200 p-5 rounded-2xl shadow-lg border border-base-300/50 transition-transform hover:scale-[1.02] duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-text-primary">{trip.name}</h3>
            <p className="text-sm text-text-secondary">{new Date(trip.startTime).toLocaleString()}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => generateTripPdf(trip)}
              className="p-2 rounded-full bg-base-300 hover:bg-brand-primary text-text-secondary hover:text-white transition-colors"
              aria-label="Export to PDF"
              title="Export to PDF"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 rounded-full bg-base-300 hover:bg-red-500 text-text-secondary hover:text-white transition-colors"
              aria-label="Delete trip"
              title="Delete trip"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
              <DistanceIcon className="w-6 h-6 text-brand-primary mb-1"/>
              <p className="text-xs text-text-secondary">Distance</p>
              <p className="font-semibold text-text-primary">{trip.distance.toFixed(2)} km</p>
          </div>
          <div className="flex flex-col items-center">
              <TimeIcon className="w-6 h-6 text-brand-primary mb-1"/>
              <p className="text-xs text-text-secondary">Duration</p>
              <p className="font-semibold text-text-primary">{(trip.duration / 60).toFixed(1)} min</p>
          </div>
          <div className="flex flex-col items-center">
              <AreaIcon className="w-6 h-6 text-brand-primary mb-1"/>
              <p className="text-xs text-text-secondary">Area</p>
              <p className="font-semibold text-text-primary">{(trip.area / 10000).toFixed(2)} ha</p>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-base-300/50 pt-4 space-y-2">
          {(trip.startLocation && trip.startLocation !== 'Location lookup failed') && (
              <div className="flex items-center text-sm">
                  <MapPinIcon className="w-4 h-4 mr-2 text-green-400 flex-shrink-0"/>
                  <span className="text-text-secondary mr-1">From:</span>
                  <span className="text-text-primary truncate" title={trip.startLocation}>{trip.startLocation}</span>
              </div>
          )}
          {(trip.endLocation && trip.endLocation !== 'Location lookup failed') && (
              <div className="flex items-center text-sm">
                  <MapPinIcon className="w-4 h-4 mr-2 text-red-400 flex-shrink-0"/>
                  <span className="text-text-secondary mr-1">To:</span>
                  <span className="text-text-primary truncate" title={trip.endLocation}>{trip.endLocation}</span>
              </div>
          )}
      </div>
    </div>
  );
};

export default TripCard;