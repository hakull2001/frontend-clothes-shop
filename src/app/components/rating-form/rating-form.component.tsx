import React, { useEffect } from "react";
import { Checkbox, FormControlLabel, Grid } from "@material-ui/core";
import clsx from "clsx";
import dayjs from "dayjs";
import { Form, useForm } from "@app/hooks/use-form.hook";
import { Category, UpdateCategoryDto } from "@app/models/category.model";
import { DEFAULT_DATETIME_FORMAT } from "@app/shared/constants/common";
import Controls from "../controls";
import { titleCase } from "@core/helpers/string.helper";
import { ProductRate, UpdateProductRateDto } from "@app/models/product-rate.model";
import { Rating } from "@material-ui/lab";

const initialProductRateValues: UpdateProductRateDto = {
  id: 0,
  value : 0,
  comment : "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

type PropTypes = {
  isEdit: boolean;
  isView: boolean;
  recordForAction: ProductRate;
  addOrEdit: (values: UpdateProductRateDto, resetForm: () => void) => void;
  productRates: ProductRate[];
};

function RatingForm(props: PropTypes) {
  const { isEdit, isView, recordForAction, addOrEdit, productRates } = props;

  if (recordForAction.id) {
    initialProductRateValues.id = recordForAction.id;
  }

  const productRateItem = () => {
    return productRates
      .map((item) => ({
        id: item.id,
        value: item.value,
        comment : item.comment
      }))
      .filter((item) => (isEdit ? item.id !== recordForAction.id : true));
  };

  const validate = (fieldValues = values) => {
    const temp = { ...errors };

    if ("name" in fieldValues) {
      temp.name =
        fieldValues.name.trim() !== "" ? "" : "Trường này là bắt buộc";
    }

    setErrors({
      ...temp,
    });

    return fieldValues === values && Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialProductRateValues, true, validate);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      if (validate()) {
        addOrEdit(values, resetForm);
      }
      return;
    }
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if ((isView || isEdit) && recordForAction.id) {
      setValues({
        ...recordForAction,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForAction, isView, isEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid
          item
          xs={isView ? 6 : 12}
          style={{ textAlign: isView ? "left" : "center" }}
        >
          <Controls.Input
            name="value"
            label="Số sao (1-5)"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
            InputProps={{
              readOnly: isView,
            }}
          />
          <Controls.Input
            name="comment"
            label="Bình luận"
            multiline
            maxRows={8}
            disabled={isView}
            value={values.description}
            error={errors.description}
            onChange={handleInputChange}
            InputProps={{
              readOnly: isView,
              classes: {
                disabled: "bs-text-black",
              },
            }}
          />
        </Grid>
        <Grid
          item
          xs={isView ? 6 : 12}
          style={{ textAlign: isView ? "left" : "center" }}
        >
          {isView && (
            <>
              <Controls.Input
                name="createdAt"
                label="Được tạo lúc"
                value={dayjs(values.createdAt).format(DEFAULT_DATETIME_FORMAT)}
                InputProps={{
                  readOnly: isView,
                }}
              />
              <Controls.Input
                name="updatedAt"
                label="Được cập nhật lúc"
                value={dayjs(values.updatedAt).format(DEFAULT_DATETIME_FORMAT)}
                InputProps={{
                  readOnly: isView,
                }}
              />
            </>
          )}
        </Grid>
        {!isView && (
          <Grid item xs={12}>
            <div style={{ textAlign: "center" }}>
              <Controls.Button type="submit" text="Đánh giá" />
              <Controls.Button
                text="Đặt lại"
                color="default"
                onClick={resetForm}
              />
            </div>
          </Grid>
        )}
      </Grid>
    </Form>
  );
}

export default RatingForm;
