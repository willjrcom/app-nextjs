'use client';

import React, { useState } from 'react';
import PersonForm from '../person/form';
import ButtonsModal from '../buttons-modal';
import Client from '@/app/entities/client/client';
import DateComponent from '@/app/utils/date';
import { useSession } from 'next-auth/react';
import CreateFormsProps from '../create-forms-props';
import DeleteClient from '@/app/api/client/delete/route';
import { useClients } from '@/app/context/client/context';
import ModalHandler from '@/app/components/modal/modal';
import NewClient from '@/app/api/client/new/route';
import UpdateClient from '@/app/api/client/update/route';


const ClientForm = ({ item, isUpdate }: CreateFormsProps<Client>) => {
    const modalHandler = ModalHandler();
    const context = useClients();
    const [client, setPerson] = useState<Client>(item as Client || new Client())
    const { data } = useSession();

    const submit = async () => {
        if (!data) return;
        client.birthday = DateComponent(client.birthday)
        const response = isUpdate ? await UpdateClient(client, data) : await NewClient(client, data)

        if (response) {
            modalHandler.setShowModal(false)
            context.addItem(client)
        }
    }
    
    const onDelete = async () => {
        if (!data) return;
        DeleteClient(client.id, data)
        modalHandler.setShowModal(false)
        context.removeItem(client.id)
    }

    return (
        <>
            <PersonForm person={client} onPersonChange={setPerson}/>
            <ButtonsModal isUpdate={client.id !== ''} onSubmit={submit} onDelete={onDelete} onCancel={() =>
            modalHandler.setShowModal(false)}/>
        </>
    );
};

export default ClientForm;