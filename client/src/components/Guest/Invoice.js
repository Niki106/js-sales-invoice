import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Document,
  Image,
  Font,
  Page,
  PDFViewer,
  Text,
  StyleSheet,
  View,
  Tspan,
} from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

import microsoft_yahei from 'fonts/chinese.msyh.ttf';
import logoTitle from 'images/logo_title.png';

const mapStateToProps = (state) => {
  const loading = state.loading.value;
  return { loading };
};

export default connect(mapStateToProps)((props) => {

  return (
    <PDFViewer height="100%">
      <Document>
        <Page>
          <View>
            <View>
              <Text>Invoice</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
});
