import React, { useRef, useEffect } from "react";
import {useLocalObservable} from "mobx-react-lite";
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import { runInAction } from "mobx";
import useAuth from "../../hooks/UseAuth";

export const UseNote = () => {
    const created = useRef(false);

    const { auth } = useAuth();

    const noteStore = useLocalObservable(() => ({
        notes: [],
        hubConnection: null,

        createHubConnection() {
            this.hubConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5114/notesHub", {
                accessTokenFactory: () => auth?.accessToken,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": `Bearer ${auth?.accessToken}`,
                },
                withCredentials: true } 
            ).withAutomaticReconnect().build();

            this.hubConnection.start().catch(error => console.log("Klaida! ", error));
            this.hubConnection.on('LoadNotes', notes => {
                runInAction(() => {
                    this.notes = notes;
                })
            })

            this.hubConnection.on('ReceiveNote', note => {
                runInAction(() => {
                    //this.notes.unshift(note);
                    this.notes.splice(0, 0, note);
                })
            })

            this.hubConnection.on('RemoveNote', note => {
                runInAction(() => {
                    this.notes.splice(this.notes.findIndex(n => n.id === note.id), 1);
                })
            })
        },

        stopHubConnection() {
            if (this.hubConnection?.state === HubConnectionState.Connected) {
                this.hubConnection.stop().catch(error => console.log('Klaida: ', error))
            }
        }
    }));

    useEffect(() => {
        if(!created.current) {
            noteStore.createHubConnection();
            created.current = true;
        }

        return () => {
            noteStore.stopHubConnection();
            noteStore.notes = [];
        }
    }, [noteStore])

    return {
        noteStore
    }
}