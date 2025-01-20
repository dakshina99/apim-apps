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

import React from 'react';
import { styled } from '@mui/material/styles';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { Link, withRouter } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';

import { resourceMethod, resourcePath, ScopeValidation } from 'AppData/ScopeValidation';
import VerticalDivider from 'AppComponents/Shared/VerticalDivider';

const PREFIX = 'LabelsButton';

const classes = {
    root: `${PREFIX}-root`,
    backLink: `${PREFIX}-backLink`,
    backIcon: `${PREFIX}-backIcon`,
    backText: `${PREFIX}-backText`,
    createNewVersionWrapper: `${PREFIX}-createNewVersionWrapper`,
    createNewVersion: `${PREFIX}-createNewVersion`,
    linkText: `${PREFIX}-linkText`,
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.root}`]: {
        background: theme.palette.background.paper,
        borderBottom: 'solid 1px ' + theme.palette.grey.A200,
        display: 'flex',
        alignItems: 'center',
    },
    [`& .${classes.backLink}`]: {
        alignItems: 'center',
        textDecoration: 'none',
        display: 'flex',
    },
    [`& .${classes.backIcon}`]: {
        color: theme.palette.primary.main,
        fontSize: 56,
        cursor: 'pointer',
    },
    [`& .${classes.backText}`]: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        fontFamily: theme.typography.fontFamily,
    },
    [`& .${classes.createNewVersionWrapper}`]: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    [`& .${classes.createNewVersion}`]: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: theme.custom.createNewVersionButtonColor || 'inherit',
    },
    [`& .${classes.linkText}`]: {
        fontSize: theme.typography.fontSize,
    },
}));

/**
 *
 * Function to Attach, Detach a 'Labels' button
 *
 * @param {any} props props
 * @returns {*} React Labels function component
 * @constructor
 */
function LabelsButton(props) {
    const { api, isAPIProduct } = props;
    return (
        <Root>
            <ScopeValidation resourceMethod={resourceMethod.POST}
                resourcePath={isAPIProduct ? resourcePath.API_PRODUCT_COPY : resourcePath.API_COPY}>
                <div className={classes.createNewVersionWrapper} id='labels-btn'>
                    <VerticalDivider height={70} />
                    <Link
                        className={classes.createNewVersion}
                        to={(isAPIProduct ? '/api-products/' : '/apis/') + api.id + '/labels'}
                        style={{ minWidth: 60 }}
                    >
                        <div>
                            <BookmarksIcon />
                        </div>
                        <Typography variant='caption'>
                            <FormattedMessage
                                id='Apis.Details.components.Labels'
                                defaultMessage='API Labels'
                            />
                        </Typography>
                    </Link>
                </div>
            </ScopeValidation>
        </Root>
    );
}

export default withRouter(LabelsButton);
