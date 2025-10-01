// @ts-nocheck
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import PropTypes from "prop-types";

interface LoadingScreen {
  loading: boolean;
}

export default function LoadingScreen(props: LoadingScreen) {
  const { loading } = props;
  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          backgroundColor: "white",
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        open={loading}
      >
        <div className="w-96 h-72">
          <img
            //src="https://uat-tools.trrgroup.com/storage/INTRANET/PROD/Asset/LoadingGIF/LIN_Loading_V2(Develop Version).gif"
            src={`${import.meta.env.VITE_APP_TRR_URL_LOADING}`}
            className="light-logo"
            alt="Metronic light logo++++++++++++"
          />
        </div>
      </Backdrop>
    </div>
  );
}
