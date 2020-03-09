import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { useForm } from 'react-hook-form';

import ImageGallery from 'react-image-gallery';

import '../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/'
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/'
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/'
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  },
  button: {
    marginRight: theme.spacing(1)
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
  const classes = useStyles();

  // For form
  const [formValues, setFormValues] = React.useState({ photos: [] });
  const { register, handleSubmit, watch, errors } = useForm();
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
          <div>
            <Button variant='contained' component='label'>
              Загрузить
              <input
                type='file'
                multiple
                accept='image/*'
                style={{ display: 'none' }}
                onChange={event => {
                  const uploadingPhotoArray = [];
                  for (let photo of event.target.files) {
                    uploadingPhotoArray.push({
                      original: URL.createObjectURL(photo),
                      thumbnail: URL.createObjectURL(photo)
                    });
                  }
                  setFormValues({
                    ...formValues,
                    photos: [...formValues.photos, ...uploadingPhotoArray]
                  });
                }}
              />
            </Button>
            <ImageGallery items={formValues.photos} />
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
      <div>
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
