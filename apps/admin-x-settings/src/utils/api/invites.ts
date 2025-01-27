import {Meta, createMutation, createQuery} from '../apiRequests';

export interface UserInvite {
    created_at: string;
    email: string;
    expires: number;
    id: string;
    role_id: string;
    role?: string;
    status: string;
    updated_at: string;
}

export interface InvitesResponseType {
    meta?: Meta;
    invites: UserInvite[];
}

const dataType = 'InvitesResponseType';

export const useBrowseInvites = createQuery<InvitesResponseType>({
    dataType,
    path: '/invites/'
});

export const useAddInvite = createMutation<InvitesResponseType, {email: string, roleId: string}>({
    method: 'POST',
    path: () => '/invites/',
    body: ({email, roleId}) => ({
        invites: [{
            email: email,
            role_id: roleId,
            expires: null,
            status: null,
            token: null
        }]
    }),
    updateQueries: {
        dataType,
        // Assume that all invite queries should include this new one
        update: (newData, currentData) => ({
            ...(currentData as InvitesResponseType),
            invites: [
                ...((currentData as InvitesResponseType).invites),
                ...newData.invites
            ]
        })
    }
});

export const useDeleteInvite = createMutation<unknown, string>({
    path: id => `/invites/${id}/`,
    method: 'DELETE',
    updateQueries: {
        dataType,
        update: (_, currentData, id) => ({
            ...(currentData as InvitesResponseType),
            invites: (currentData as InvitesResponseType).invites.filter(invite => invite.id !== id)
        })
    }
});
