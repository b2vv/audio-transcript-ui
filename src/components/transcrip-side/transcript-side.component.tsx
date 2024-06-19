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

    const [err, setErr] = React.useState<IErrorState>();
    const [isLoading, setLoading] = React.useState(false);

    const submitHandler = React.useCallback((formData: FormData) => {
        setLoading(true);
        setErr(undefined);
        api.sendAudio(formData).then()
            .catch((err) => setErr(api.errorState(err)))
            .finally(() => setLoading(false));
    }, [api]);

    return (
        <>
            <AlertComponent title="Server Error" message={api.getError(err ?? {})?.message as string}/>
            <div className={styles.transcriptions}>
                <div>
                    <FormFileComponent submitHandler={submitHandler} isLoading={isLoading}/>
                </div>

            </div>
        </>
    )
});

TranscriptSideComponent.displayName = 'TranscriptSideComponent';
