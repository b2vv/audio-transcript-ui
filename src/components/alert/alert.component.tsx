import React from "react";

import styles from './index.module.css';


interface IAlertProps {
    title: string;
    message: string | null;
}

export const AlertComponent: React.FC<IAlertProps> = React.memo((props) => {
    const { message, title } = props;
    const [open, setOpen] = React.useState(false);

    const clickHandler = React.useCallback(() => {
        setOpen(false);
    }, []);

    React.useEffect(() => {
        setOpen(!!message);
    }, [message]);

    return (
        <>
        {open && (
            <div className={styles['alert-danger']}>
                <header>
                    <span className={styles.title}>{title}</span>
                    <button onClick={clickHandler}>X</button></header>
                <section>{message}</section>
            </div>
        )}
        </>
    )
});

AlertComponent.displayName = "AlertComponent";
