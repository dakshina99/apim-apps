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
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { FormattedMessage, useIntl } from 'react-intl';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import { isRestricted } from 'AppData/AuthManager';

const PREFIX = 'APILabels';

const classes = {
    tooltip: `${PREFIX}-tooltip`,
    listItemText: `${PREFIX}-listItemText`
};

const StyledBox = styled(Box)(({ theme }) => ({
    [`& .${classes.tooltip}`]: {
        position: 'absolute',
        right: theme.spacing(-4),
        top: theme.spacing(1),
    },

    [`& .${classes.listItemText}`]: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}));

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

/**
 * Render the labels drop down.
 * @param {JSON} props props passed from it's parents.
 * @returns {JSX} Render the labels drop down.
 */
function LabelsComponent(props) {
    const { labels, updatedLabels, setUpdatedLabels, isRevision } = props;

    const [apiFromContext] = useAPI();
    const intl = useIntl();

    if (!labels.list) {
        return null;
    } else {
        return (
            <StyledBox style={{ position: 'relative', marginTop: 10 }}>
                <Autocomplete
                    disabled={isRestricted(['apim:api_create', 'apim:api_publish'], apiFromContext)
                        || labels.list.length === 0 || isRevision
                    }
                    multiple
                    fullWidth
                    limitTags={5}
                    value={updatedLabels}
                    onChange={(e, newValue) => setUpdatedLabels(newValue)}
                    id='APILabels-autocomplete'
                    options={labels.list.map((label) => label.name)}
                    noOptionsText='No API labels defined'
                    disableCloseOnSelect
                    renderOption={(options, label, { selected }) => (
                        <li {...options}>
                            <Checkbox
                                id={label}
                                key={label}
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {label}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params}
                            disabled={isRestricted(['apim:api_create', 'apim:api_publish'], apiFromContext)
                                || labels.list.length === 0
                            }
                            fullWidth
                            label={labels.list.length !== 0 ? (
                                <FormattedMessage
                                    id='Apis.Details.Configurations.api.labels'
                                    defaultMessage='API Labels'
                                />
                            ) : (
                                <FormattedMessage
                                    id='Apis.Details.Configurations.api.labels.empty'
                                    defaultMessage='No API Labels defined.'
                                />
                            )
                            }
                            placeholder={intl.formatMessage({
                                id:'Apis.Details.Configurations.api.labels.placeholder.text',
                                defaultMessage:'Search API Labels'
                            })}
                            helperText={(
                                <FormattedMessage
                                    id='Apis.Details.Configurations.api.labels.helper.text'
                                    defaultMessage='Select API Labels for the API'
                                />
                            )}
                            margin='normal'
                            variant='outlined'
                            id='APILabels'
                        />
                    )}
                />
            </StyledBox>
        );
    }
}

export default LabelsComponent;
