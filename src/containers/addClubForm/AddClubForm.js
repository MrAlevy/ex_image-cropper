import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ReactCrop from 'react-image-crop';

import { useForm } from 'react-hook-form';

import ImageGallery from 'react-image-gallery';

import { CropImageModal } from './CropImageModal';

import 'react-image-crop/dist/ReactCrop.css';
import '../../../node_modules/react-image-gallery/styles/css/image-gallery.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: '1200px',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  button: {
    marginRight: theme.spacing(1),
    display: 'flex'
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  stepForm: {
    display: 'flex',
    flexDirection: 'column'
  },
  underStepperContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '10%'
  }
}));

function getSteps() {
  return ['Название', 'Адрес', 'Информация', 'Фотографии', 'Расписание'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Шаг 1: Введите название';
    case 1:
      return 'Шаг 2: Укажите адрес';
    case 2:
      return 'Шаг 3: Заполните информацию о клубе';
    case 3:
      return 'Шаг 4: Загрузите фотографии';
    case 4:
      return 'Шаг 5: Установите расписание занятий';
    default:
      return 'Unknown step';
  }
}

export const AddClubForm = () => {
  /**
   * @param {File} image - Image File Object
   * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
   * @param {String} fileName - Name of the returned file in Promise
   */
  function getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
      }, 'image/jpeg');
    });
  }

  const classes = useStyles();

  const [isCropModalOpen, setIsCropModalOpen] = React.useState({
    isOpen: false,
    image: ''
  });
  const [crop, setCrop] = React.useState({ aspect: 16 / 12 });
  // For form
  const { register, handleSubmit, watch, errors } = useForm();

  const [formValues, setFormValues] = React.useState({
    photos: []
  });
  const onSubmit = data => {
    console.log(data);
    setFormValues({ ...formValues, ...data });
  };

  // For stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const totalSteps = () => {
    return getSteps().length;
  };

  const isStepOptional = step => {
    return;
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const skippedSteps = () => {
    return skipped.size;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps() - skippedSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = step => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted(new Set());
    setSkipped(new Set());
  };

  const isStepSkipped = step => {
    return skipped.has(step);
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  /**
   *
   * Return the form depends on the current active step
   *
   */
  function renderSwitchStep() {
    switch (activeStep) {
      case 0:
        return (
          <form key={1} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id='standard-helperText'
              name='name'
              label='название клуба'
              inputRef={register}
              defaultValue={formValues.name}
            />
            <input type='submit' />
          </form>
        );
      case 1:
        return (
          <form key={2} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id='standard-helperText'
              name='city'
              label='город'
              inputRef={register}
              defaultValue={formValues.city}
              onBlur={event =>
                setFormValues({
                  ...formValues,
                  [event.target.name]: event.target.value
                })
              }
            />
            <TextField
              id='standard-helperText'
              name='street'
              label='улица'
              inputRef={register}
              defaultValue={formValues.street}
            />
            <TextField
              id='standard-helperText'
              name='house'
              label='дом'
              inputRef={register}
              defaultValue={formValues.house}
            />
            <TextField
              id='standard-helperText'
              name='lit'
              label='корпус'
              inputRef={register}
              defaultValue={formValues.lit}
            />
            <input type='submit' />
          </form>
        );
      case 2:
        return <div>hello</div>;
      case 3:
        return (
          <div className={classes.stepForm}>
            <CropImageModal
              open={isCropModalOpen.isOpen}
              handleClose={() =>
                setIsCropModalOpen({ isOpen: false, image: '' })
              }
              makeCrop={() => {
                const image = document.createElement('img');
                image.src = isCropModalOpen.image;
                getCroppedImg(image, crop, 'preview.jpg').then(res => {
                  const blobUrl = URL.createObjectURL(res);
                  console.log(blobUrl); // it returns cropped image in this shape of url: "blob:http://something..."
                  setFormValues({
                    ...formValues,
                    photos: [
                      ...formValues.photos,
                      { original: blobUrl, thumbnail: blobUrl }
                    ]
                  });
                });
                setIsCropModalOpen({ isOpen: false, image: '' });
              }}
              render={() => (
                <ReactCrop
                  src={isCropModalOpen.image}
                  crop={crop}
                  onChange={newCrop => setCrop(newCrop)}
                />
              )}
            />
            <div className={classes.button}>
              <Button variant='contained' component='label'>
                выбрать
                <input
                  type='file'
                  //multiple
                  accept='image/*'
                  style={{ display: 'none' }}
                  onChange={event => {
                    setIsCropModalOpen({
                      isOpen: true,
                      image: URL.createObjectURL(event.target.files[0])
                    });
                    // const uploadingPhotoArray = [];
                    // for (let photo of event.target.files) {
                    //   uploadingPhotoArray.push({
                    //     photo: photo,
                    //     original: URL.createObjectURL(photo),
                    //     thumbnail: URL.createObjectURL(photo)
                    //   });
                    // }
                    // setFormValues({
                    //   ...formValues,
                    //   photos: [...formValues.photos, ...uploadingPhotoArray]
                    // });
                  }}
                />
              </Button>
            </div>
            {formValues.photos.length !== 0 && (
              <ImageGallery items={formValues.photos} />
            )}
            {/*             {formValues.photos.length && (
              <ReactCrop
                src={formValues.photos[0].original}
                crop={crop}
                onChange={newCrop => setCrop(newCrop)}
              />
            )} */}
            {/*             <Button
              onClick={() => {
                const image = document.createElement('img');
                image.src = formValues.photos[0].original;
                getCroppedImg(image, crop, 'preview.jpg').then(res => {
                  const blobUrl = URL.createObjectURL(res);
                  console.log(blobUrl); // it returns cropped image in this shape of url: "blob:http://something..."
                  setFormValues({
                    ...formValues,
                    photos: [
                      ...formValues.photos,
                      { original: blobUrl, thumbnail: blobUrl }
                    ]
                  });
                });
              }}
            >
              crop
            </Button> */}
          </div>
        );
      case 4:
        return <div>hello</div>;
      default:
        return;
    }
  }

  return (
    <div className={classes.root}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          if (isStepOptional(index)) {
            buttonProps.optional = (
              <Typography variant='caption'>Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <div className={classes.underStepperContent}>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>

            {renderSwitchStep()}

            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
              {isStepOptional(activeStep) && !completed.has(activeStep) && (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              {activeStep !== steps.length &&
                (completed.has(activeStep) ? (
                  <Typography variant='caption' className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleComplete}
                  >
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
