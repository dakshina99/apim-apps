/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import API from 'AppData/api';
import { useIntl, FormattedMessage } from 'react-intl';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import HelpBase from 'AppComponents/AdminPages/Addons/HelpBase';
import ListBase from 'AppComponents/AdminPages/Addons/ListBase';
import DescriptionIcon from '@mui/icons-material/Description';
import Link from '@mui/material/Link';
import Configurations from 'Config';
import Delete from 'AppComponents/Labels/DeleteLabel';
import AddEdit from 'AppComponents/Labels/AddEditLabel';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';

/**
 * API call to get api category list
 * @returns {Promise}.
 */
function apiCall() {
    const restApi = new API();
    return restApi
        .apiCategoriesListGet()
        .then((result) => {
            return result.body.list;
        })
        .catch((error) => {
            throw error;
        });
}
const TruncatedNameCell = ({ children }) => {
    return (
        <Box sx={{ maxWidth: '200px' }}>
            <Typography
                noWrap
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {children}
            </Typography>
        </Box>
    );
};
/**
 * Render a list
 * @returns {JSX} Header AppBar components.
 */
export default function ListLabels() {
    const intl = useIntl();
    const columProps = [
        { name: 'id', options: { display: false } },
        {
            name: 'name',
            label: intl.formatMessage({
                id: 'AdminPages.Labels.table.header.category.name',
                defaultMessage: 'Category Name',
            }),
            options: {
                filter: true,
                sort: true,
                customBodyRender: (data) => {
                    return <TruncatedNameCell>{data}</TruncatedNameCell>;
                },
            },
        },
        {
            name: 'description',
            label: intl.formatMessage({
                id: 'AdminPages.Labels.table.header.category.description',
                defaultMessage: 'Description',
            }),
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: 'numberOfAPIs',
            label: intl.formatMessage({
                id: 'AdminPages.Labels.table.header.category.number.of.apis',
                defaultMessage: 'Number of APIs',
            }),
            options: {
                filter: true,
                sort: true,
            },
        },
    ];
    const addButtonProps = {
        triggerButtonText: intl.formatMessage({
            id: 'AdminPages.Labels.List.addButtonProps.triggerButtonText',
            defaultMessage: 'Add Label',
        }),
        /* This title is what as the title of the popup dialog box */
        title: intl.formatMessage({
            id: 'AdminPages.Labels.List.addButtonProps.title',
            defaultMessage: 'Add Label',
        }),
    };
    const searchProps = {
        searchPlaceholder: intl.formatMessage({
            id: 'AdminPages.Labels.List.search.default',
            defaultMessage: 'Search by Label name',
        }),
        active: true,
    };
    const pageProps = {
        help: (
            <HelpBase>
                <List component='nav' aria-label='main mailbox folders'>
                    <ListItem button>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <Link
                            target='_blank'
                            href={
                                Configurations.app.docUrl
                                + 'reference/customize-product/customizations/customizing-the-developer-portal/'
                                + 'customize-api-listing/api-category-based-grouping/'
                            }
                            underline='hover'
                        >
                            <ListItemText
                                primary={(
                                    <FormattedMessage
                                        id='AdminPages.Labels.List.help.link.one'
                                        defaultMessage='API Category based Grouping'
                                    />
                                )}
                            />
                        </Link>
                    </ListItem>
                </List>
            </HelpBase>
        ),
        pageStyle: 'half',
        title: intl.formatMessage({
            id: 'AdminPages.Labels.List.title.labels',
            defaultMessage: 'Labels',
        }),
    };

    const emptyBoxProps = {
        title: (
            <Typography gutterBottom variant='h5' component='h2'>
                <FormattedMessage
                    id='AdminPages.Labels.List.empty.title.labels'
                    defaultMessage='Labels'
                />
            </Typography>
        ),
    };

    return (
        <ListBase
            columProps={columProps}
            pageProps={pageProps}
            addButtonProps={addButtonProps}
            searchProps={searchProps}
            emptyBoxProps={emptyBoxProps}
            apiCall={apiCall}
            EditComponent={AddEdit}
            editComponentProps={{
                icon: <EditIcon />,
                title: 'Edit API Category',
            }}
            DeleteComponent={Delete}
        />
    );
}
