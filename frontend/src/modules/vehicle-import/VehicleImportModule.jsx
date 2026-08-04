import { useState } from 'react';

export default function VehicleImportModule() {
  const [status, setStatus] = useState('Ready to import vehicle data');
  const [fileName, setFileName] = useState('');

  const handleImport = () => {
    setStatus(`Imported ${fileName || 'sample vehicle dataset'} successfully`);
  };

  return (
    <section className="import-panel">
      <h2>Vehicle Import Module</h2>
      <p>{status}</p>
      <input
        type="text"
        placeholder="Enter source file name"
        value={fileName}
        onChange={(event) => setFileName(event.target.value)}
      />
      <button onClick={handleImport}>Import Vehicles</button>
    </section>
  );
}
