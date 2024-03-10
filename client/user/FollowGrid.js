import { Link } from "react-router-dom";
import { GridList, Avatar, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    }
}));
export default function FollowGrid(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList} cols={10}>
                {
                    props.people.map((person, i) => {
                        return (
                            <Link to={'/user/' + person._id} style={{ textDecoration: 'none' }}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    boxShadow={3}
                                    borderRadius={8}
                                    p={4}
                                    bgcolor="white"
                                    textAlign="center"
                                    m={2}
                                    height={160}
                                >
                                    <Avatar src={'/api/users/photo/' + person._id} className={classes.bigAvatar} />
                                    <Typography className={classes.tileText}>
                                        {person.name}
                                    </Typography>
                                </Box>
                            </Link>
                        )
                    })
                }
            </GridList>
        </div>
    );
}