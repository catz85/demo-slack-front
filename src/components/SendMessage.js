import React from 'react';
import styled from 'styled-components';
import { Form, Input } from 'formik-semantic-ui';

const InputStyledWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
    `;

const SendMessage = ({ placeholder, onSubmit }) => {
    
    return (<Form initialValues={{ text: '' }}
        onSubmit={onSubmit}>
        {({ values }) => (
            <Form.Children>
                <InputStyledWrapper>
                    <Input
                        inputProps={{ autoComplete: "off", placeholder: `Message to # ${placeholder}` }}
                        name="text" value="values.text" fluid />
                </InputStyledWrapper>
            </Form.Children>
        )}
    </Form>)
}

export default SendMessage