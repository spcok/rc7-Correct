import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Animal, LogType, LogEntry } from '../../types';
import { useOperationalLists } from '../../hooks/useOperationalLists';

import WeightForm from './forms/WeightForm';
import FeedForm from './forms/FeedForm';
import TemperatureForm from './forms/TemperatureForm';
import StandardForm from './forms/StandardForm';
import BirthForm from './forms/BirthForm';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: any) => Promise<void>;
  animal?: Animal;
  initialDate?: string;
  defaultLogType?: LogType;
  dailyLogs?: LogEntry[];
}

export default function AddEntryModal({ isOpen, onClose, onSave, animal, initialDate, defaultLogType = LogType.WEIGHT, dailyLogs = [] }: AddEntryModalProps) {
  const [logType, setLogType] = useState<LogType>(defaultLogType);
  
  const user = useAuthStore(state => state.user) || {} as any;
  const getInitials = () => {
    if (user.initials) return user.initials;
    if (user.first_name && user.last_name) return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user.name) {
      const parts = user.name.split(' ');
      if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (user.email) return user.email.substring(0, 2).toUpperCase();
    return 'UNK';
  };
  const userInitials = getInitials();
  
  const { lists = [] } = useOperationalLists() || {};
  const safeLists = lists || []; 
  
  const getListType = (l: any) => String(l.listType || l.list_type || '').toUpperCase();
  
  let foodTypes = safeLists.filter((l: any) => getListType(l) === 'FOOD_TYPE');
  if (foodTypes.length === 0) {
    foodTypes = [
      { id: 'f1', value: 'Mice' }, { id: 'f2', value: 'Rats' }, { id: 'f3', value: 'Chicks' }, 
      { id: 'f4', value: 'Quail' }, { id: 'f5', value: 'Insects' }, { id: 'f6', value: 'Fish' },
      { id: 'f7', value: 'Pellets' }, { id: 'f8', value: 'Fruit/Veg' }
    ];
  }

  let feedMethods = safeLists.filter((l: any) => getListType(l) === 'FEED_METHOD');
  if (feedMethods.length === 0) {
    feedMethods = [
      { id: 'm1', value: 'Scatter' }, { id: 'm2', value: 'Tongs' }, { id: 'm3', value: 'Bowl' },
      { id: 'm4', value: 'Block' }, { id: 'm5', value: 'Gutted' }, { id: 'm6', value: 'Yolked' },
      { id: 'm7', value: 'Skinned' }
    ];
  }

  let eventTypes = safeLists.filter((l: any) => getListType(l) === 'EVENT_TYPE').map((l: any) => l.value);
  if (eventTypes.length === 0) {
    eventTypes = ['Routine', 'Medical Check', 'Training Session', 'Enrichment', 'Maintenance'];
  }

  if (!isOpen || !animal) return null;

  const date = initialDate || new Date().toISOString().split('T')[0];

  const handleSubmit = async (payload: any) => {
    await onSave(payload);
  };

  const renderForm = () => {
    const existingLog = dailyLogs.find(l => l.animalId === animal.id && l.logType === logType);

    switch (logType) {
      case LogType.WEIGHT:
        return <WeightForm key={existingLog?.id || 'w_new'} animal={animal} date={date} userInitials={userInitials} existingLog={existingLog} onSave={handleSubmit} onCancel={onClose} />;
      case LogType.FEED:
        return <FeedForm key={existingLog?.id || 'f_new'} animal={animal} date={date} userInitials={userInitials} existingLog={existingLog} foodTypes={foodTypes} feedMethods={feedMethods} onSave={handleSubmit} onCancel={onClose} />;
      case LogType.TEMPERATURE:
        return <TemperatureForm key={existingLog?.id || 't_new'} animal={animal} date={date} userInitials={userInitials} existingLog={existingLog} onSave={handleSubmit} onCancel={onClose} />;
      case LogType.BIRTH:
        return <BirthForm animal={animal} date={date} userInitials={userInitials} onSave={handleSubmit} onCancel={onClose} />;
      default:
        return <StandardForm key={existingLog?.id || 's_new'} logType={logType} animal={animal} date={date} userInitials={userInitials} existingLog={existingLog} eventTypes={eventTypes} onSave={handleSubmit} onCancel={onClose} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Log Data</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{animal.name} ({animal.species})</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {Object.values(LogType).filter(type => type !== LogType.SYSTEM).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLogType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  logType === type ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}
