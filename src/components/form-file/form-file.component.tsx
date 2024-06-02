import React from "react";
import {PaperPlane} from "@src/components/icons/paper-plane.tsx";

import styles from './index.module.css';

interface IFormFileProps {
    submitHandler: (data: FormData) => void;
    isLoading: boolean;
}

interface IFileState {
    name?: string;
    path?: string;
}

export const FormFileComponent: React.FC<IFormFileProps> = React.memo((props) => {
    const {submitHandler: submit, isLoading} = props;
    const reader = React.useMemo(() => new FileReader(), []);
    const [fileLink, setFileLink] = React.useState<string>();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [file, setFile] = React.useState<IFileState>({
        name: '',
        path: ''
    });

    const loadHandler = React.useCallback((e: ProgressEvent<FileReader>) => {
        if (e?.target?.result) {
            setFileLink(e?.target?.result as string);
        }
    }, []);



    const submitHandler = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(new FormData(e.target as HTMLFormElement))
    }, [submit]);

    const fileHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // const fileURL = URL.createObjectURL(e.target?.files?.[0] as Blob);
        // setFileLink(fileURL)
        reader.readAsDataURL(e.target?.files?.[0] as Blob);
        setFile({
            name: e.target?.files?.[0].name,
            path: e.target.value
        });
    }, [reader]);

    const fileNameHandler = React.useCallback(() => {
        fileRef.current?.click();
    }, []);

    React.useEffect(() => {
        reader.onloadend = loadHandler;
    }, [reader, loadHandler])


    return (
        <>
            <div>
                <audio key={fileLink} controls={true}>
                    {fileLink && (
                        <source src={fileLink} type="audio/mp4"/>
                    )}
                </audio>
            </div>
            <form onSubmit={submitHandler}>
                <fieldset disabled={isLoading} className={styles.fields}>
                    <input name="audio"
                           ref={fileRef}
                           value={file?.path}
                           type="file"
                           accept="audio/*"
                           onChange={fileHandler}/>
                    <input
                        value={file?.name}
                        placeholder="Click to select a file"
                        readOnly={true}
                        onClick={fileNameHandler}
                        className={styles.file}
                    />
                    <button type="submit" className="btn" disabled={!file?.path}>
                        Send {PaperPlane}
                    </button>
                </fieldset>
            </form>
        </>
    );
});

FormFileComponent.displayName = 'FormFileComponent';
