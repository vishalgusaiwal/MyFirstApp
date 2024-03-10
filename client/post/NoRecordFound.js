import React from 'react';
import Typography from '@material-ui/core/Typography';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';

const NoRecordsMessage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <SentimentDissatisfiedIcon style={{ fontSize: '80px', color: '#888888' }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
                User Have not posted anything yet
            </Typography>
        </div>
    );
};

export default NoRecordsMessage;
