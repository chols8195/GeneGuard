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

    const downloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onLoad = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');

            const downloadLink = document.createElement('a');
            downloadLink.download = `${group.name}-invite-qr.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{
                background: 'var(--color-background)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <Modal.Title style={{ color: 'var(--text-primary)' }}>
                    Share Group Invite
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                background: 'var(--color-background-alt)',
                textAlign: 'center',
                padding: '32px'
            }}>
                <h5 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
                    {group.name}
                </h5>

                {/* QR code */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    display: 'inline-block',
                    marginBottom: '24px'
                }}>
                    <QRCodeSVG
                        id="qr-code-svg"
                        value={inviteURL}
                        size={256}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                {/* Invite Code */}
                <div style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>
                        Or share this code:
                    </p>
                    <code style={{
                        color: 'var(--text-primary)',
                        fontSize: '20px',
                        fontWeight: '600',
                        letterSpacing: '2px',
                        display: 'block',
                        marginBottom: '12px'
                    }}>
                        {group.invite_code}
                    </code>
                    <Button
                        variant="outline-light"
                        size="sm"
                        onClick={copyInviteCode}
                        style={{
                            fontSize: '12px',
                            padding: '6px 16px'
                        }}
                    >
                        {copied ? 'Copied' : 'Copy Code'}
                    </Button>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
                    Scan the QR code or enter the code manually to join this group
                </p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Button 
                        className="btn-primary-large"
                        onClick={downloadQR}
                        style={{ padding: '12px 24px', fontSize: '14px' }}
                    >
                        Download QR Code 
                    </Button>
                    <Button 
                        className="btn-secondary-large"
                        onClick={downloadQR}
                        style={{ padding: '12px 24px', fontSize: '14px' }}
                    >
                        Close
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};