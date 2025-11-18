import { QRCodeSVG } from 'qrcode.react';
import { Modal, Button } from 'react-boorstrap';
import { useState } from 'react';

export const GroupInviteQR = ({ group, show, onHide}) => {
    const [copied, setCopied] = useState(false);

    // Created invite URL with group info encoded 
    const inviteUrl = `${window.location.origin}/join-group?code=${group.invite_code}&name=${encodeURIComponent(group.name)}`;

    const copyInviteCode = () => {
        navigator.clipboard.writeText(group.invite_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
}