import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { create } from 'ipfs-http-client'


// import PropTypes from "prop-types";
import {
  Stack,
  TextField,
  FormControlLabel,
  FormLabel,
  FormControl,
  Radio,
  RadioGroup,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";

import Iconify from "../components/Iconify";
import { useMoralis, useMoralisFile } from "react-moralis";
import { toast } from "react-toastify";

const Input = styled("input")({
  display: "none",
});

function CreateProductModal(props) {
  const { Moralis, user } = useMoralis();
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();

  const navigate = useNavigate();
  const [creator, setCreator] = useState("product");
  const [imgs, setImgs] = useState("");
  const [loading, setLoading] = useState(false);

  const Product = Moralis.Object.extend("Products");
  const prod = new Product();

  const networkId = window.ethereum.networkVersion;


  const handleChange = (event) => {
    setCreator(event.target.value);
  };

  const client = create('https://ipfs.infura.io:5001/api/v0')

  const handlechangeImage = async (e) => {
    const file = e.target.files[0];
    const added = await client.add(file)
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    setImgs(url);
  };

  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required("Required this field!"),
    description: Yup.string().required("Required this field!"),
    price: Yup.number()
      .required("Required this field!")
      .min(0, "Price should be Grater than 0."),
    videourl: Yup.string().required("Required this field!"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      videourl: "",
      price: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(props.currentUser);
      try {
        props.setLoading(true);
        props.setLoading(true);
        prod.set("type", creator);
        prod.set("title", values.title);
        prod.set("description", values.description);
        prod.set("videourl", values.videourl);
        prod.set("price", values.price);
        // prod.set("image", imgs);
        prod.set("photo", imgs);
        prod.set("username", props.currentUser);
        await prod.save();
        toast.success("Successfully created!");
        resetForm();
        props.setLoading(false);
        props.close();
        props.update(!props.state);
      } catch (error) {
        setLoading(false);
        props.setLoading(true);
      }
    },
  });

  return (
    <div>
      <Dialog open={props.op} onClose={props.close} fullWidth>
        <FormikProvider value={formik} className={Container}>
          <DialogContent style={{ overflowX: "hidden" }}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={formik.handleSubmit}
              style={{
                // width: "50vw",
                justifyContent: "center",
                marginLeft: "auto",
                marginRight: "auto",
                // marginTop: "100px",
              }}
            >
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Type :
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={creator}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="product"
                      control={<Radio />}
                      label="Product"
                    />
                    <FormControlLabel
                      value="service"
                      control={<Radio />}
                      label="Service"
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  type="text"
                  {...formik.getFieldProps("title")}
                  error={Boolean(formik.touched.title && formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                  fullWidth
                  name="description"
                  type="text"
                  label="Description"
                  {...formik.getFieldProps("description")}
                  error={Boolean(
                    formik.touched.description && formik.errors.description
                  )}
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
                {/*  */}
                <div className="d-create-file">
                  <div>
                    <p id="file_name" className="text-grey-500">
                      PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                    </p>
                  </div>

                  <label
                    htmlFor="files"
                    id="get_file"
                    // name="file"
                    className="btn-main"
                    type="file"
                    style={{ backgroundColor: "#6b46c1" }}
                  // {...formik.getFieldProps("file")}
                  // error={Boolean(formik.touched.file && formik.errors.file)}
                  // helperText={formik.touched.file && formik.errors.file}
                  >
                    Browse
                  </label>
                  <TextField
                    id="files"
                    type="file"
                    onChange={handlechangeImage}
                    style={{ display: "none" }}
                    // {...formik.getFieldProps("file")}
                    error={Boolean(formik.touched.file && formik.errors.file)}
                    helperText={formik.touched.file && formik.errors.file}
                  />
                </div>
                <TextField
                  fullWidth
                  name="videourl"
                  //   type="video"
                  label="Add video URL"
                  {...formik.getFieldProps("videourl")}
                  error={Boolean(
                    formik.touched.videourl && formik.errors.videourl
                  )}
                  helperText={formik.touched.videourl && formik.errors.videourl}
                />

                <TextField
                  fullWidth
                  name="price"
                  type="number"
                  label={`Price in TRX}`}
                  {...formik.getFieldProps("price")}
                  error={Boolean(formik.touched.price && formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />

                {/* ----------------------------------------------- */}
              </Stack>
              <DialogActions>
                {/* <p style={{ color: "red" }}>Error</p> */}

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={formik.isSubmitting}
                  disabled={loading}
                >
                  {loading ? "Submiting..." : "Submit"}
                </LoadingButton>
                <Button onClick={props.close} variant="contained">
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </FormikProvider>
      </Dialog>
    </div>
  );
}

export default CreateProductModal;
