/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import API from 'AppData/api';
import Alert from 'AppComponents/Shared/Alert';
import LabelsComponent from '../Configuration/components/LabelsComponent';

const PREFIX = 'NewVersion';

const classes = {
    FormControl: `${PREFIX}-FormControl`,
    FormControlOdd: `${PREFIX}-FormControlOdd`,
    FormLabel: `${PREFIX}-FormLabel`,
    buttonWrapper: `${PREFIX}-buttonWrapper`,
    root: `${PREFIX}-root`,
    group: `${PREFIX}-group`,
    helpButton: `${PREFIX}-helpButton`,
    helpIcon: `${PREFIX}-helpIcon`,
    htmlTooltip: `${PREFIX}-htmlTooltip`
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.FormControl}`]: {
        padding: 0,
        width: '100%',
        marginTop: 20,
    },

    [`& .${classes.FormControlOdd}`]: {
        padding: 0,
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        marginTop: 0,
    },

    [`& .${classes.FormLabel}`]: {
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left',
    },

    [`& .${classes.buttonWrapper}`]: {
        paddingTop: 20,
    },

    [`& .${classes.root}`]: {
        padding: 20,
        marginTop: 20,
    },

    [`& .${classes.group}`]: {
        flexDirection: 'row',
    },

    [`& .${classes.helpButton}`]: {
        padding: 0,
        minWidth: 20,
    },

    [`& .${classes.helpIcon}`]: {
        fontSize: 16,
    },

    [`& .${classes.htmlTooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(14),
        border: '1px solid #dadde9',
        '& b': {
            fontWeight: theme.typography.fontWeightMedium,
        },
    }
}));

const Labels = ({ api, intl }) => {
    const [attachedLabels, setAttachedLabels] = useState(api.labels.map((label) => label.name));
    const [allLabels, setAllLabels] = useState({})
    const [updatedLabels, setUpdatedLabels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        API.labels().then((response) => setAllLabels(response.body));
        const apiClient = new API();
        apiClient.getAPILabels(api.id).then((response) => 
            setUpdatedLabels(response.body.list.map((label) => label.name)));
    }, []);

    /**
     * Handles the submit action for labels update call
     */
    const handleSubmit = async () => {
        setIsLoading(true);
        
        const apiClient = new API();
        const addList = updatedLabels.filter(label => !attachedLabels.includes(label));
        const deleteList = attachedLabels.filter(label => !updatedLabels.includes(label));

        const addResponse = await apiClient.attachAPILabels(api.id, 
            allLabels.list?.filter(label => addList.includes(label.name)));
        const deleteResponse = await apiClient.detachAPILabels(api.id, 
            allLabels.list?.filter(label => deleteList.includes(label.name)));
        
        if (addResponse && addResponse.status !== 200 && deleteResponse && deleteResponse.status !== 200) {
            setIsLoading(false);
            Alert.error(intl.formatMessage({
                id: 'Apis.Details.Labels.Update.error',
                defaultMessage: 'Something went wrong while updating the attached label list!',
            }));
        } else if (addResponse && addResponse.status !== 200) {
            if (deleteResponse) {
                const updatedList = deleteResponse.body.list.map((label) => label.name);
                
                setAttachedLabels(updatedList)
                setUpdatedLabels(updatedList);
                
                Alert.info(intl.formatMessage({
                    id: 'Apis.Details.Labels.Update.success',
                    defaultMessage: 'Successfully detached labels',
                }));
            }
            setIsLoading(false);
            Alert.error(intl.formatMessage({
                id: 'Apis.Details.Labels.Update.error',
                defaultMessage: 'Something went wrong while Attaching labels to the API!',
            }));
        } else if (deleteResponse && deleteResponse.status !== 200) {
            if (addResponse) {
                const updatedList = addResponse.body.list.map((label) => label.name);
                
                setAttachedLabels(updatedList)
                setUpdatedLabels(updatedList);
                
                Alert.info(intl.formatMessage({
                    id: 'Apis.Details.Labels.Update.success',
                    defaultMessage: 'Successfully attached labels',
                }));
            }
            setIsLoading(false);
            Alert.error(intl.formatMessage({
                id: 'Apis.Details.Labels.Update.error',
                defaultMessage: 'Something went wrong while Detaching labels from the API!',
            }));
        } else if (addResponse || deleteResponse) {
            const updatedList = [...new Set([...(addResponse? addResponse.body.list.map((label) => label.name) : []),
                ...(deleteResponse ? deleteResponse.body.list.map((label) => label.name) : [])])];
            
            setAttachedLabels(updatedList)
            setUpdatedLabels(updatedList);
            setIsLoading(false);
            Alert.info(intl.formatMessage({
                id: 'Apis.Details.Labels.Update.success',
                defaultMessage: 'Successfully updated the attached labels list',
            }));
        } else {
            setIsLoading(false);
        }
    }

    return (
        <Root>
            <Container maxWidth='md'>
                <div className={classes.titleWrapper}>
                    <Typography variant='h4' component='h2' align='left' className={classes.mainTitle}>
                        <FormattedMessage
                            id='Apis.Details.Labels'
                            defaultMessage='API Labels'
                        />
                    </Typography>
                </div>
                <Grid container spacing={7}>
                    <Grid item xs={12}>
                        <Paper className={classes.root} elevation={0}>
                            <LabelsComponent
                                labels={allLabels}
                                updatedLabels={updatedLabels}
                                setUpdatedLabels={setUpdatedLabels}
                                isRevision={api.isRevision}
                            />
                            <div className={classes.buttonWrapper}>
                                <Grid
                                    container
                                    direction='row'
                                    alignItems='flex-start'
                                    spacing={1}
                                    className={classes.buttonSection}
                                >
                                    <Grid item>
                                        <div>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                id='updateBtn'
                                                onClick={handleSubmit}
                                                disabled={
                                                    api.isRevision
                                                    || isLoading
                                                }
                                            >
                                                <FormattedMessage
                                                    id='Apis.Details.Labels.update'
                                                    defaultMessage='Save'
                                                />
                                            </Button>
                                        </div>
                                    </Grid>
                                    <Grid item>
                                        <Link to={'/apis/' + api.id + '/overview'}>
                                            <Button 
                                                id='cancelBtn'
                                            >
                                                <FormattedMessage
                                                    id='Apis.Details.Labels.cancel'
                                                    defaultMessage='Cancel'
                                                />
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Root>
    );
};

Labels.propTypes = {
    api: PropTypes.shape({
        id: PropTypes.string,
        apiType: PropTypes.string,
        labels: PropTypes.shape({})
    }).isRequired
};

export default injectIntl(withAPI(Labels));