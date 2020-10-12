import React from 'react';
import styled from 'styled-components';
import { Header } from 'semantic-ui-react'

const HeaderStyledWrapper = styled.div`
    grid-column: 3;
    grid-row: 1;
    `;


export default ({ channel }) => (
    <HeaderStyledWrapper>
        <Header textAlign="center">
            # {channel}
        </Header>
    </HeaderStyledWrapper>
)