import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { db } from "../services/database";

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
    }
}