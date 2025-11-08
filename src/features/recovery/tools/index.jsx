import React from 'react';
import BreathingTool from './BreathingTool';

const RecoveryToolsPage = () => {
  return (
    <div style={{padding:16}}>
      <h1 style={{textAlign:'center', marginBottom:'2rem'}}>Recovery Tools</h1>
      <BreathingTool defaultInhale={4} defaultHold={4} defaultExhale={6} defaultCycles={6} />
    </div>
  );
};

export default RecoveryToolsPage;
