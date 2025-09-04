import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LocationPoint, Trip } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculatePathDistance, calculatePolygonArea } from './utils/calculations';
import { reverseGeocode } from './services/geocoding';
import StatCard from './components/StatCard';
import TripCard from './components/TripCard';
import Modal from './components/Modal';
import { PlayIcon, StopIcon, SaveIcon, TrashIcon, SpeedIcon, DistanceIcon, AreaIcon, TimeIcon } from './components/icons';

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useLocalStorage<boolean>('isRecording', false);
  const [currentPath, setCurrentPath] = useLocalStorage<LocationPoint[]>('currentPath', []);
  const [startTime, setStartTime] = useLocalStorage<number | null>('startTime', null);
  const [savedTrips, setSavedTrips] = useLocalStorage<Trip[]>('savedTrips', []);
  
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [isSaveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [tripName, setTripName] = useState<string>('');
  
  const [watchId, setWatchId] = useState<number | null>(null);

  const startRecording = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state === 'denied') {
            setError('Geolocation permission has been denied. Please enable it in your browser or system settings.');
            return;
        }
    }

    setError(null);
    setCurrentPath([]);
    const now = Date.now();
    setStartTime(now);
    setIsRecording(true);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        const newPoint: LocationPoint = {
          lat: latitude,
          lng: longitude,
          speed: speed,
          timestamp: position.timestamp,
        };
        setCurrentPath((prevPath) => [...prevPath, newPoint]);
      },
      (err) => {
        setError(`Geolocation Error: ${err.message}`);
        setIsRecording(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    setWatchId(id);
  }, [setCurrentPath, setIsRecording, setStartTime]);

  const stopRecording = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsRecording(false);
  }, [watchId, setIsRecording]);
  
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);


  useEffect(() => {
    let timer: number | undefined;
    if (isRecording) {
      timer = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const tripData = useMemo(() => {
    const distance = calculatePathDistance(currentPath);
    const area = calculatePolygonArea(currentPath);
    const duration = startTime ? (currentTime - startTime) / 1000 : 0;
    const currentSpeed = currentPath.length > 0 ? currentPath[currentPath.length - 1].speed : null;
    return { distance, area, duration, currentSpeed };
  }, [currentPath, startTime, currentTime]);

  const handleStartStop = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSave = () => {
    if (currentPath.length < 2) {
      alert("Not enough data to save a trip.");
      return;
    }
    const now = new Date();
    const defaultName = `Trip on ${now.toLocaleDateString()} at ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    setTripName(defaultName);
    setSaveModalOpen(true);
  };
  
  const confirmSaveTrip = async () => {
    if (!tripName.trim()) {
      alert("Trip name cannot be empty.");
      return;
    }
    setIsSaving(true);

    let startLocation = 'N/A';
    let endLocation = 'N/A';
    
    if (currentPath.length > 0) {
        try {
            const [start, end] = await Promise.all([
                reverseGeocode(currentPath[0].lat, currentPath[0].lng),
                reverseGeocode(currentPath[currentPath.length - 1].lat, currentPath[currentPath.length - 1].lng)
            ]);
            startLocation = start;
            endLocation = end;
        } catch (err) {
            console.error("Failed to fetch location names", err);
        }
    }

    const finalDistance = calculatePathDistance(currentPath);
    const finalArea = calculatePolygonArea(currentPath);
    const endTime = Date.now();
    const finalDuration = startTime ? (endTime - startTime) / 1000 : 0;

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name: tripName,
      path: currentPath,
      distance: finalDistance,
      duration: finalDuration,
      area: finalArea,
      startTime: startTime || Date.now(),
      endTime: endTime,
      startLocation,
      endLocation,
    };

    setSavedTrips(prev => [newTrip, ...prev]);
    resetCurrentTrip();
    setIsSaving(false);
    setSaveModalOpen(false);
  };

  const resetCurrentTrip = () => {
    setCurrentPath([]);
    setStartTime(null);
    setIsRecording(false);
    setTripName('');
  };

  const handleDeleteTrip = (id: string) => {
    setSavedTrips(prev => prev.filter(trip => trip.id !== id));
  };
  
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="min-h-screen text-text-primary p-4 sm:p-6 lg:p-8 font-sans flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
            GeoLogger Pro
          </h1>
          <p className="text-text-secondary mt-2">Your intelligent GPS tracking companion.</p>
        </header>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center mb-4">{error}</div>}

        <main className="bg-base-200/50 backdrop-blur-md border border-base-300/50 rounded-3xl p-6 shadow-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Live Tracking</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Speed" value={tripData.currentSpeed ? (tripData.currentSpeed * 3.6).toFixed(1) : '0.0'} unit="km/h" icon={<SpeedIcon className="w-6 h-6"/>} />
            <StatCard label="Distance" value={tripData.distance.toFixed(3)} unit="km" icon={<DistanceIcon className="w-6 h-6"/>} />
            <StatCard label="Area" value={(tripData.area / 10000).toFixed(3)} unit="ha" icon={<AreaIcon className="w-6 h-6"/>} />
            <StatCard label="Duration" value={formatDuration(tripData.duration)} unit="" icon={<TimeIcon className="w-6 h-6"/>} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartStop}
              className={`flex items-center justify-center gap-2 w-full sm:w-48 px-6 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg
                ${isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-brand-primary hover:bg-brand-secondary text-white'}`}
            >
              {isRecording ? <StopIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
              <span>{isRecording ? 'Stop' : 'Start'}</span>
            </button>
            {!isRecording && currentPath.length > 0 && (
                <>
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-full text-lg font-bold transition-colors duration-300 bg-base-300 hover:bg-green-600 hover:text-white"
                >
                    <SaveIcon className="w-6 h-6"/>
                    <span>Save Trip</span>
                </button>
                <button
                    onClick={resetCurrentTrip}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 rounded-full text-lg font-bold transition-colors duration-300 bg-base-300 hover:bg-red-600 hover:text-white"
                >
                    <TrashIcon className="w-6 h-6"/>
                    <span>Discard</span>
                </button>
                </>
            )}
          </div>
        </main>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">Saved Trips</h2>
          {savedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary bg-base-200/50 rounded-2xl p-8">No trips saved yet. Start a recording to log your first journey!</p>
          )}
        </section>
      </div>

      <footer className="text-center text-text-secondary text-sm py-4 mt-8">
        Created By Yash K Pathak
      </footer>

      <Modal isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} title="Save Your Trip">
          <div className="space-y-4">
            <label htmlFor="tripName" className="block text-sm font-medium text-text-secondary">Trip Name</label>
            <input
              id="tripName"
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full bg-base-300 border border-base-100 rounded-lg p-2 text-text-primary focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
            <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setSaveModalOpen(false)} className="px-4 py-2 rounded-lg bg-base-300 hover:bg-base-100 transition-colors" disabled={isSaving}>Cancel</button>
                <button onClick={confirmSaveTrip} className="px-4 py-2 rounded-lg bg-brand-primary hover:bg-brand-secondary text-white transition-colors disabled:bg-gray-500" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default App;