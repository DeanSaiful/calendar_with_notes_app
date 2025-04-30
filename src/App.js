import React, { useState, useEffect } from 'react';

function App() {
  const [time, setTime] = useState(new Date());
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState({});
  const [selectedNote, setSelectedNote] = useState(null);
  const [displayedDate, setDisplayedDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const malaysiaTime = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' })
      );
      setTime(malaysiaTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load notes from localStorage when the component mounts
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  const getDateKey = (dateObj) => {
    return dateObj.toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });
  };

  const handleSubmit = () => {
    const key = getDateKey(time);
    const currentTime = time.toLocaleTimeString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });

    if (note.trim() !== '') {
      const newEntry = { time: currentTime, text: note.trim() };
      const updatedNotes = [...(notes[key] || []), newEntry];
      const newNotes = { ...notes, [key]: updatedNotes };

      // Save the updated notes to localStorage
      localStorage.setItem('notes', JSON.stringify(newNotes));

      setNotes(newNotes);
      setNote('');
    }
  };

  const handleCellClick = (day) => {
    const clickedDate = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
    const key = getDateKey(clickedDate);
    if (notes[key]) {
      setSelectedNote({ date: key, content: notes[key] });
    }
  };

  const handleDeleteNote = (indexToDelete) => {
    const key = selectedNote.date;
    const updatedContent = selectedNote.content.filter((_, idx) => idx !== indexToDelete);
    const updatedNotes = { ...notes, [key]: updatedContent };
    if (updatedContent.length === 0) {
      delete updatedNotes[key];
    }

    // Save the updated notes to localStorage
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    setNotes(updatedNotes);
    setSelectedNote({ date: key, content: updatedContent });
  };

  const renderCalendar = () => {
    const start = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1);
    const end = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0);
    const days = [];

    for (let i = 0; i < start.getDay(); i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let i = 1; i <= end.getDate(); i++) {
      const dateObj = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), i);
      const key = getDateKey(dateObj);
      const hasNote = notes[key];
    
      const isToday =
        dateObj.getFullYear() === time.getFullYear() &&
        dateObj.getMonth() === time.getMonth() &&
        dateObj.getDate() === time.getDate();
    
      days.push(
        <div
          key={i}
          onClick={() => handleCellClick(i)}
          className={`border p-2 rounded text-center cursor-pointer transition-all ${
            hasNote ? 'bg-green-300 hover:bg-green-400' : 'bg-white hover:bg-gray-100'
          } ${isToday ? 'border-2 border-blue-600 font-bold' : ''}`}
        >
          {i}
        </div>
      );
    }
    

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-700">Calendar With Notes App</h1>
          <p className="text-2xl mt-2 text-gray-700">
            {time.toLocaleTimeString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
          </p>
          <p className="text-lg text-gray-600">
            {getDateKey(time)}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note for today..."
            className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-blue-400"
            rows={3}
          ></textarea>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Note
          </button>
        </div>

        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() =>
                setDisplayedDate(
                  new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1)
                )
              }
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
            >
              Prev
            </button>
            <div className="text-xl font-semibold text-gray-700">
              {monthNames[displayedDate.getMonth()]} {displayedDate.getFullYear()}
            </div>
            <button
              onClick={() =>
                setDisplayedDate(
                  new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1)
                )
              }
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
            >
              Next
            </button>
          </div>

          <div className="mb-4">
            <label className="mr-2 font-medium text-gray-600">Select Year:</label>
            <select
              className="border border-gray-300 p-1 rounded"
              value={displayedDate.getFullYear()}
              onChange={(e) =>
                setDisplayedDate(new Date(Number(e.target.value), displayedDate.getMonth()))
              }
            >
              {Array.from({ length: 50 }, (_, i) => {
                const year = 2000 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <button
              onClick={() => setDisplayedDate(new Date())}
              className="bg-blue-300 hover:bg-blue-400 mx-5 px-3 py-1 rounded text-white"
            >
              Jump to Today
            </button>

          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-600 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
            <div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>

        {selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                Notes on {selectedNote.date}
              </h2>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {selectedNote.content.map((item, index) => (
                  <li key={index} className="border-b pb-2 flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{item.time}</p>
                      <p className="text-gray-800">{item.text}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(index)}
                      className="ml-4 text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedNote(null)}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
