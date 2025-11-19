import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { db } from "../services/database";
import lockImg from "../assets/img/lock.png";
import groupImg from "../assets/img/group.png";

export const JoinGroupPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);

    const [inviteCode, setInviteCode] = useState('');
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        // Get invite code and group name from url 
        const code = searchParams.get('code');
        const name = searchParams.get('name');

        if (code) {
            setInviteCode(code);
            if (name) {
                setGroupName(decodeURIComponent(name));
            }

            // if user is logged in show confirmation 
            if (user) {
                setShowConfirmation(true);
            }
        }
    }, [searchParams, user]);

    const handleJoinGroup = async () => {
        if (!user?.uid) {
            // Redirect to auth with return URL 
            const returnUrl = `/join-group?code=${inviteCode}&name=${encodeURIComponent(groupName)}`;
            navigate(`/auth?mode=login&redirect=${encodeURIComponent(returnUrl)}`);
            return;
        }

        if (!inviteCode) {
            setError('Please enter an invite code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await db.joinGroup(user.uid, inviteCode);
            setSuccess(`Successfully joined ${groupName || 'the group'}!`);

            //  Redirect to group page after 2 secs
            setTimeout(() => {
                navigate('/groups');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to join group');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/groups');
    };

    if (!user) {
        return ( 
            <section style={{
                padding: '120px 0', 
                background: 'var(--color-background)',
                minHeight: '100vh', 
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                style={{
                                    background: 'var(--color-surface)',
                                    borderRadius: '16px',
                                    padding: '48px',
                                    textAlign: 'center',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{ width: '120px', height: '120px', margin: '0 auto 24px auto' }}>
                                    <img src={lockImg} alt="LOCK" style={{ width: '100%', height: '100%', objectFit: 'contain'}} />
                                </div>
                                <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
                                    Sign In Required
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                                    {groupName
                                        ? `You need to sign in to join "${groupName}"`
                                        : 'You need to sign in to join this group'
                                    }
                                </p>
                                <button 
                                    className="btn-primary-large"
                                    onClick={() => {
                                        const returnUrl = `/join-group?code=${inviteCode}&name=${encodeURIComponent(groupName)}`;
                                        navigate(`/auth?mode=login&redirect=${encodeURIComponent(returnUrl)}`);
                                    }}
                                    style={{ marginRight: '12px' }}
                                >
                                    Sign In 
                                </button>
                                <button 
                                    className="btn-secondary-large"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }

    return (
        <section style={{
            padding: '120px 0',
            background: 'var(--color-background)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center'
        }}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={6}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {showConfirmation ? (
                                // Confirmation view 
                                <div style={{
                                    background: 'var(--color-surface)',
                                    borderRadius: '16px',
                                    padding: '48px',
                                    textAlign: 'center',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ width: '120px', height: '120px', margin: '0 auto 24px auto' }}>
                                        <img src={{ groupImg }} alt="GROUP" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
                                        Join Group?
                                    </h2>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                        Do you want to join?
                                    </p>
                                    <h3 style={{
                                        color: 'var(--color-sage)',
                                        marginBottom: '32px',
                                        fontSize: '28px',
                                        fontWeight: '600'
                                    }}>
                                        {groupName || 'this group'}?
                                    </h3>

                                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                                    {success && <Alert variant="success" className="mb-4">{success}</Alert>}

                                    {!success && (
                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                            <button 
                                                className="btn-primary-large"
                                                onClick={handleJoinGroup}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="loading" style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            marginRight: '8px',
                                                            display: 'inline-block',
                                                            verticalAlign: 'middle'
                                                        }}></span>
                                                        Joining...
                                                    </>
                                                ) : (
                                                    'Yes, Join Group'
                                                )}
                                            </button>
                                            <button 
                                                className="btn-secondary-large"
                                                onClick={handleCancel}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Enter code manually view 
                                <div style ={{
                                    background: 'var(--color-surface)',
                                    borderRadius: '16px',
                                    padding: '48px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <h2 style={{
                                        color: 'var(--text-primary)',
                                        marginBottom: '16px',
                                        textAlign: 'center'
                                    }}>
                                        Join a Group
                                    </h2>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        marginBottom: '32px',
                                        textAlign: 'center'
                                    }}>
                                        Enter the invite code to join a group
                                    </p>
                                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                                    {success && <Alert variant="success" className="mb-4">{success}</Alert>}
                                    
                                    <div className="form-group">
                                        <label className="form-label">Invite Code</label>
                                        <input 
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter 16-character code"
                                            value={inviteCode}
                                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                            maxLength={16}
                                            style={{ textAlign: 'center', letterSpacing: '2px' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button 
                                            classname="btn-primary-large"
                                            onClick={handleJoinGroup}
                                            disabled={loading || !inviteCode}
                                            style={{ flex: 1 }}
                                        >
                                            {loading ? 'Joining...' : 'Join Group'}
                                        </button>
                                        <button 
                                            className="btn-secondary-large"
                                            onClick={handleCancel}
                                            disabled={loading}
                                            style={{ flex: 1}}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};