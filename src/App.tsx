import React, {useState} from 'react'
import './App.css'

import {TranscriptionService} from '@src/api/transcription.service.ts';
import {IErrorState} from '@src/api/api-error.service.ts';
import {FormFileComponent} from '@src/components/form-file';
import {AlertComponent} from '@src/components/alert';

function App() {
    const api = React.useMemo(() => new TranscriptionService(), []);

    const [transcriptions, setTranscriptions] = useState<string[]>([]);
    const [err, setErr] = React.useState<IErrorState>();
    const [isLoading, setLoading] = React.useState(false);

    const listRef = React.useRef<HTMLDivElement>(null);


    const submitHandler = React.useCallback((formData: FormData) => {
        setLoading(true);
        setErr(undefined);
        api.sendAudio(formData).then(({data}) => {
            setTranscriptions((prev) => [...prev, data.segments.map((item) => item.text).join('\n')]);
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight ?? 0;
            }
        })
            .catch((err) => setErr(api.errorState(err)))
            .finally(() => setLoading(false));
    }, [api]);

    return (
        <>
            <AlertComponent title="Server Error" message={api.getError(err ?? {})?.message as string}/>
            <div className="transcriptions">
                <section className="transcriptions_list" ref={listRef}>
                    <div className="transcriptions_list-wrap">
                        {transcriptions.map((item, index) => (
                            <div key={index} className="transcriptions_text">
                                {item}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="transcriptions_text">
                                Loading...
                            </div>
                        )}
                    </div>
                </section>
                <div>
                    <FormFileComponent submitHandler={submitHandler} isLoading={isLoading}/>
                </div>

            </div>
        </>
    )
}

export default App
