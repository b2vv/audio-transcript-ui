import React from 'react'
import styles from './index.module.css';

import {TranscriptionService} from '@src/api/transcription.service.ts';
import {TranscriptSideComponent} from '@src/components/transcrip-side';
import {TranscriptListSideComponent} from "@src/components/transcript-list-side";

function App() {
    const api = React.useMemo(() => new TranscriptionService(), []);

    return (
        <div className={styles.page}>
            <TranscriptSideComponent api={api} />
            <TranscriptListSideComponent api={api} />
        </div>
    )
}

export default App
