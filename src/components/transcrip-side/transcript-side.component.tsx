import React from 'react';
import {TranscriptionService} from "@src/api/transcription.service.ts";
import {IErrorState} from "@src/api/api-error.service.ts";
import {AlertComponent} from "@src/components/alert";
import {FormFileComponent} from "@src/components/form-file";

import styles from './index.module.css';

interface ITranscriptSideProps {
    api: TranscriptionService;
}

export const TranscriptSideComponent: React.FC<ITranscriptSideProps> = React.memo((props) => {
    const {api} = props;

    const [transcriptions, setTranscriptions] = React.useState<string[]>([]);
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
            <div className={styles.transcriptions}>
                <section className={styles.list} ref={listRef}>
                    <div className={styles['list-wrap']}>
                        {transcriptions.map((item, index) => (
                            <div key={index} className={styles.text}>
                                {item}
                            </div>
                        ))}
                        {isLoading && (
                            <div className={styles.text}>
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
});

TranscriptSideComponent.displayName = 'TranscriptSideComponent';
