import { createReportReglament } from '../../helpers';
import reportReglamentReducer, {
  ReglamentPeriodNames,
  fetchReglamentFailure,
  fetchReglamentRequest,
  fetchReglamentSuccess,
  initialState,
  initialValuesAnnual,
  initialValuesDaily,
  initialValuesMouthly,
  initialValuesWeekly,
  resetPeriod,
  resetReglament,
  saveReglamentPopupValues,
  setInitialReglament,
  setPeriod,
  setReglament,
} from './reportReglamentReducer';

describe('reportReglamentReducer', () => {
  it('should handle fetchReglamentRequest', () => {
    const nextState = reportReglamentReducer(
      initialState,
      fetchReglamentRequest(),
    );
    expect(nextState.isLoading).toBe(true);
    expect(nextState.reglament).toEqual(initialState.reglament);
    expect(nextState.incomingReglament).toEqual(initialState.reglament);
    expect(nextState.intermediateReglament).toEqual(initialState.reglament);
    expect(nextState.period).toEqual(initialState.period);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('should handle fetchReglamentSuccess', () => {
    const periodData = { name: 'Ежегодно', value: 6 };
    const previousState = {
      ...initialState,
      isLoading: true,
    };
    const nextState = reportReglamentReducer(
      previousState,
      fetchReglamentSuccess(createReportReglament(mockFilledResponseAnual)),
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.reglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.period).toEqual(periodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('should handle fetchReglamentFailure', () => {
    const previousState = {
      ...initialState,
      isLoading: true,
    };
    const nextState = reportReglamentReducer(
      previousState,
      fetchReglamentFailure(),
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.reglament).toEqual(initialState.reglament);
    expect(nextState.incomingReglament).toEqual(initialState.reglament);
    expect(nextState.intermediateReglament).toEqual(initialState.reglament);
    expect(nextState.period).toEqual(initialState.period);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  // добавить такие же тесты, с проверкой разных условий
  it('should handle setReglament', () => {
    const updatedReglamentData = { completionItem: 'runCount' };
    const previousState = {
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      identifikator: '1002430791037564631565087486679161628',
      reglament: mockFilledReglamentAnual,
      incomingReglament: mockFilledReglamentAnual,
      intermediateReglament: mockFilledReglamentAnual,
      isLoading: false,
      disabledSave: false,
    };
    const nextState = reportReglamentReducer(
      previousState,
      setReglament(updatedReglamentData),
    );
    expect(nextState.isLoading).toBe(false);
    expect(nextState.reglament).toEqual({
      ...previousState.reglament,
      ...updatedReglamentData,
    });
    expect(nextState.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.period).toEqual(previousState.period);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setPeriod. We expect the initialState to change to the default value for the "daily"', () => {
    const updatedPeriodData = { name: 'Ежедневно', value: 3 };
    const nextState = reportReglamentReducer(
      initialState,
      setPeriod('Ежедневно'),
    );

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual({
      ...initialValuesDaily,
      inputData: 0,
      reconciliationData: 0,
      validationData: 0,
      shiftData: 0,
    });
    expect(nextState.period).toEqual(updatedPeriodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setPeriod. We expect that the default values for "daily" will change to the default value for "weekly"', () => {
    const updatedPeriodData = { name: 'Еженедельно', value: 4 };
    const nextState = reportReglamentReducer(
      {
        ...initialState,
        reglament: {
          ...initialValuesDaily,
          inputData: 0,
          reconciliationData: 0,
          validationData: 0,
          shiftData: 0,
        },
      },
      setPeriod('Еженедельно'),
    );

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual({
      ...initialValuesWeekly,
      inputData: 0,
      reconciliationData: 0,
      validationData: 0,
      shiftData: 0,
    });
    expect(nextState.period).toEqual(updatedPeriodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setPeriod. We expect that the default values for "weekly" will change to the default value for "mouthly"', () => {
    const updatedPeriodData = { name: 'Ежемесячно', value: 5 };
    const nextState = reportReglamentReducer(
      {
        ...initialState,
        reglament: {
          ...initialValuesWeekly,
          inputData: 0,
          reconciliationData: 0,
          validationData: 0,
          shiftData: 0,
        },
      },
      setPeriod('Ежемесячно'),
    );

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual({
      ...initialValuesMouthly,
      inputData: 0,
      reconciliationData: 0,
      validationData: 0,
      shiftData: 0,
    });
    expect(nextState.period).toEqual(updatedPeriodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setPeriod. We expect that the default values for "mouthly" will change to the default value for "annual"', () => {
    const updatedPeriodData = { name: 'Ежегодно', value: 6 };
    const nextState = reportReglamentReducer(
      {
        ...initialState,
        reglament: {
          ...initialValuesMouthly,
          inputData: 0,
          reconciliationData: 0,
          validationData: 0,
          shiftData: 0,
        },
      },
      setPeriod('Ежегодно'),
    );

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual({
      ...initialValuesAnnual,
      inputData: 0,
      reconciliationData: 0,
      validationData: 0,
      shiftData: 0,
    });
    expect(nextState.period).toEqual(updatedPeriodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setPeriod. We expect the user values to change to the default value for "daily"', () => {
    const updatedPeriodData = { name: 'Ежедневно', value: 3 };
    const previousState = {
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      identifikator: '1002430791037564631565087486679161628',
      reglament: mockFilledReglamentAnual,
      incomingReglament: mockFilledReglamentAnual,
      intermediateReglament: mockFilledReglamentAnual,
      isLoading: false,
      disabledSave: false,
    };
    const nextState = reportReglamentReducer(
      previousState,
      setPeriod('Ежедневно'),
    );

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual({
      ...initialValuesDaily,
      inputData: 1,
      reconciliationData: 2,
      validationData: 3,
      shiftData: -4,
    });
    expect(nextState.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.period).toEqual(updatedPeriodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setPeriod. We expect the custom values to change to the default value for "weekly", and then go back to custom', () => {
    const updatedPeriodData = { name: 'Еженедельно', value: 4 };
    const previousState = {
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      identifikator: '1002430791037564631565087486679161628',
      reglament: mockFilledReglamentAnual,
      incomingReglament: mockFilledReglamentAnual,
      intermediateReglament: mockFilledReglamentAnual,
      isLoading: false,
      disabledSave: false,
    };
    const nextState = reportReglamentReducer(
      previousState,
      setPeriod('Еженедельно'),
    );

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual({
      ...initialValuesWeekly,
      inputData: 1,
      reconciliationData: 2,
      validationData: 3,
      shiftData: -4,
    });
    expect(nextState.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.period).toEqual(updatedPeriodData);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);

    const nextStateBack = reportReglamentReducer(
      previousState,
      setPeriod('Ежегодно'),
    );

    expect(nextStateBack.isLoading).toBe(initialState.isLoading);
    expect(nextStateBack.reglament).toEqual(mockFilledReglamentAnual);
    expect(nextStateBack.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextStateBack.intermediateReglament).toEqual(
      mockFilledReglamentAnual,
    );
    expect(nextStateBack.period).toEqual({ name: 'Ежегодно', value: 6 });
    expect(nextStateBack.disabledSave).toEqual(initialState.disabledSave);
  });

  it('setInitialReglament. We expect the user values to change to initialState', () => {
    const previousState = {
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: mockFilledReglamentAnual,
      incomingReglament: mockFilledReglamentAnual,
      intermediateReglament: mockFilledReglamentAnual,
      isLoading: false,
      disabledSave: false,
    };
    const nextState = reportReglamentReducer(
      previousState,
      setInitialReglament(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(initialState.reglament);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(
      initialState.intermediateReglament,
    );
    expect(nextState.period).toEqual(initialState.period);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. Saving the modal, if the period is not selected', () => {
    const amendedReglament = {
      ...mockFilledReglamentAnualWithoutPeriod,
      interval: 5,
      date: 5,
      month: 5,
      annualIntervalItem: 'annualDateOfMonth',
      completionItem: 'endDate',
      monthFromDate: 5,
    };

    const previousState = {
      ...initialState,
      reglament: amendedReglament,
      incomingReglament: mockFilledReglamentAnualWithoutPeriod,
      intermediateReglament: amendedReglament,
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(mockFilledReglamentAnualWithoutPeriod);
    expect(nextState.incomingReglament).toEqual(
      mockFilledReglamentAnualWithoutPeriod,
    );
    expect(nextState.intermediateReglament).toEqual(
      mockFilledReglamentAnualWithoutPeriod,
    );
    expect(nextState.period).toEqual(initialState.period);
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. We expect to save the values of the modal in the intermediateReglament and form a constraint string with interval with checking the default values in the conditions: runCount, dateOfMonth', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...mockFilledReglamentMouthly,
        interval: null,
        runCountValue: null,
        completionItem: 'runCount',
        dayOfMonth: null,
        monthlyIntervalItem: 'dateOfMonth',
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(mockFilledReglamentMouthly);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentMouthly);
    expect(nextState.period).toEqual({ name: 'Ежемесячно', value: 5 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. We expect to save the values of the modal window in the intermediateReglament and form a constraint string with interval with checking with the values of the conditions: runCount, dateOfMonth', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...mockFilledReglamentMouthly,
        interval: null,
        runCountValue: 5,
        completionItem: 'runCount',
        dayOfMonth: 5,
        monthlyIntervalItem: 'dateOfMonth',
      },
      isLoading: false,
      disabledSave: false,
    };

    const expectedReglament = {
      ...previousState.reglament,
      interval: 1,
      constraint: 'interval=1;day_of_month=5',
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(expectedReglament);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(expectedReglament);
    expect(nextState.period).toEqual({ name: 'Ежемесячно', value: 5 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. We expect to save the values of the modal in the intermediateReglament and form a constraint string with interval with checking the default values in the conditions: runCount, weekDayOfMonth', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...mockFilledReglamentMouthly,
        interval: null,
        runCount: null,
        completionItem: 'runCount',
        weekOfMonth: null,
        dayOfWeek: null,
        monthlyIntervalItem: 'weekDayOfMonth',
      },
    };

    const expectedReglament = {
      ...previousState.reglament,
      interval: 1,
      constraint: 'interval=1;day_of_week=monday;week_of_month=1',
      dayOfWeek: 'monday',
      weekOfMonth: 1,
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(expectedReglament);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(expectedReglament);
    expect(nextState.period).toEqual({ name: 'Ежемесячно', value: 5 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. We expect to save the values of the modal window in the intermediateReglament and form a constraint string with interval with checking with the values of the conditions: endDate, weekDayOfMonth', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...mockFilledReglamentMouthly,
        interval: 4,
        endDate: '2024-16-12T00:00:00.000',
        completionItem: 'endDate',
        weekOfMonth: 3,
        dayOfWeek: 'wednesday',
        monthlyIntervalItem: 'weekDayOfMonth',
      },
    };

    const expectedReglament = {
      ...previousState.reglament,
      interval: 1, // Устававливается в значение 1
      constraint: 'interval=1;day_of_week=wednesday;week_of_month=3',
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(expectedReglament);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(expectedReglament);
    expect(nextState.period).toEqual({ name: 'Ежемесячно', value: 5 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. We expect to store the values of the modal window in the intermediateReglament and form a constraint string with an annual interval with checking the values in the conditions: runCount, annualDateOfMonth', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...mockFilledReglamentAnual,
        interval: null,
        completionItem: 'runCount',
        runCountValue: null,
        annualIntervalItem: 'annualDateOfMonth',
        date: 2,
        monthFromDate: 3,
      },
    };

    const expectedReglament = {
      ...previousState.reglament,
      runCountValue: 1,
      constraint: 'interval=1;date=2;month=3',
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(expectedReglament);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(expectedReglament);
    expect(nextState.period).toEqual({ name: 'Ежемесячно', value: 5 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. We expect to store the values of the modal window in the intermediateReglament and form a constraint string with an annual interval with checking the values in the conditions: endDate, annualWeekDayOfMouth', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...mockFilledReglamentAnual,
        interval: 5,
        completionItem: 'endDate',
        finishDateReglament: '2024-05-06T00:00:00.000',
        annualIntervalItem: 'annualWeekDayOfMouth',
        weekOfMonth: 2,
        dayOfWeek: 'wednesday',
        monthFromWeek: 4,
      },
    };

    const expectedReglament = {
      ...previousState.reglament,
      interval: 5,
      finishDateReglament: '2024-05-06T00:00:00.000',
      constraint: 'interval=5;day_of_week=wednesday;month=4;week_of_month=2',
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );
    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(expectedReglament);
    expect(nextState.incomingReglament).toEqual(initialState.incomingReglament);
    expect(nextState.intermediateReglament).toEqual(expectedReglament);
    expect(nextState.period).toEqual({ name: 'Ежемесячно', value: 5 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('saveReglamentPopupValues. Forming a constraint string: rglType=null', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Не задан' as ReglamentPeriodNames, value: null },
      reglament: { ...mockFilledReglamentAnual, rglType: null },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(null);
  });

  it('saveReglamentPopupValues. Forming a constraint string: Daily', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежедневно' as ReglamentPeriodNames, value: 3 },
      reglament: mockFilledReglamentDaily,
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual('interval=1');
  });

  it('saveReglamentPopupValues. Forming a constraint string: Weekly: deffault', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Еженедельно' as ReglamentPeriodNames, value: 4 },
      reglament: {
        ...initialValuesWeekly,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual('interval=1');
  });

  it('saveReglamentPopupValues. Forming a constraint string: Weekly: +dayOfWeek', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Еженедельно' as ReglamentPeriodNames, value: 4 },
      reglament: {
        ...initialValuesWeekly,
        dayOfWeek: 'monday,wednesday',
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(
      'interval=1;day_of_week=monday,wednesday',
    );
  });

  it('saveReglamentPopupValues. Forming a constraint string: Mouthly deffault (not by selecting values for: dayOfMonth & interval, but by selecting the radio button)', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...initialValuesMouthly,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual('interval=1;day_of_month=1');
  });

  it('saveReglamentPopupValues. Forming a constraint string: Mouthly: +dayOfMonth +interval', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...initialValuesMouthly,
        interval: 3,
        dayOfMonth: 3,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual('interval=3;day_of_month=3');
  });

  it('saveReglamentPopupValues. Forming a constraint string: Mouthly deffault (not by selecting values for: dayOfWeek & interval, but by selecting the radio button)', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...initialValuesMouthly,
        monthlyIntervalItem: 'weekDayOfMonth',
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(
      'interval=1;day_of_week=monday;week_of_month=1',
    );
  });

  it('saveReglamentPopupValues. Forming a constraint string: Mouthly: +dayOfWeek +interval', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежемесячно' as ReglamentPeriodNames, value: 5 },
      reglament: {
        ...initialValuesMouthly,
        monthlyIntervalItem: 'weekDayOfMonth',
        dayOfWeek: 'wednesday',
        weekOfMonth: 3,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(
      'interval=1;day_of_week=wednesday;week_of_month=3',
    );
  });

  it('saveReglamentPopupValues. Forming a constraint string: Annual deffault (not by selecting values for: date & monthFromDate, but by selecting the radio button)', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: {
        ...initialValuesAnnual,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual('interval=1;date=1;month=1');
  });

  it('saveReglamentPopupValues. Forming a constraint string: Annual: +date +month', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: {
        ...initialValuesAnnual,
        interval: 3,
        date: 3,
        monthFromDate: 12,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(
      'interval=3;date=3;month=12',
    );
  });

  it('saveReglamentPopupValues. Forming a constraint string: Annual deffault (not by selecting values for: date & weekOfMonth & monthFromWeek, but by selecting the radio button)', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: {
        ...initialValuesAnnual,
        annualIntervalItem: 'annualWeekDayOfMouth',
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(
      'interval=1;day_of_week=monday;month=1;week_of_month=1',
    );
  });

  it('saveReglamentPopupValues. Forming a constraint string: Annual: +date +weekOfMonth +monthFromWeek', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: {
        ...initialValuesAnnual,
        interval: 3,
        annualIntervalItem: 'annualWeekDayOfMouth',
        dayOfWeek: 'wednesday',
        monthFromWeek: 3,
        weekOfMonth: 3,
        inputData: 1,
        reconciliationData: 1,
        validationData: 1,
        shiftData: 1,
      },
    };

    const nextState = reportReglamentReducer(
      previousState,
      saveReglamentPopupValues(),
    );

    expect(nextState.reglament.constraint).toEqual(
      'interval=3;day_of_week=wednesday;month=3;week_of_month=3',
    );
  });

  it('resetReglament. We expect that the data entered in the modal will be canceled and set to intermediate', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: mockFilledReglamentMouthly,
      incomingReglament: mockFilledReglamentAnual,
      intermediateReglament: mockFilledReglamentAnual,
    };
    const nextState = reportReglamentReducer(previousState, resetReglament());

    expect(nextState.isLoading).toBe(initialState.isLoading);
    expect(nextState.reglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.period).toEqual({ name: 'Ежегодно', value: 6 });
    expect(nextState.disabledSave).toEqual(initialState.disabledSave);
  });

  it('resetReglament. We expect that the data entered in the modal window will be canceled and set to the data that originally came from the backend', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      reglament: mockFilledReglamentMouthly,
      incomingReglament: mockFilledReglamentAnual,
      intermediateReglament: mockFilledReglamentAnual,
    };
    const nextState = reportReglamentReducer(previousState, resetReglament());

    expect(nextState.reglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.incomingReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.intermediateReglament).toEqual(mockFilledReglamentAnual);
    expect(nextState.period).toEqual({ name: 'Ежегодно', value: 6 });
  });

  it('resetPeriod. We expect that the data entered in the modal window will be canceled and set to the data that originally came from the backend', () => {
    const previousState = {
      ...initialState,
      period: { name: 'Ежегодно' as ReglamentPeriodNames, value: 6 },
      incomingReglament: mockFilledReglamentMouthly,
    };

    const nextState = reportReglamentReducer(previousState, resetPeriod());

    expect(nextState.incomingReglament).toEqual(mockFilledReglamentMouthly);
    expect(nextState.period).toEqual({
      name: 'Ежемесячно' as ReglamentPeriodNames,
      value: 5,
    });
  });
});

const mockFilledResponseAnual = {
  IDENTIFIKATOR: '1002430791037564631565087486679161628',
  DATA_NACHALA: '2023-05-31T00:00:00.000',
  DATA_OKONCHANIYA: '2023-06-01T00:00:00.000',
  TIP_REGLAMENTA: 6,
  KOLICHESTVO_POVTORENIJ: null,
  USLOVIYA_ZAPUSKA: 'interval=5;date=5;month=5',
  'FLAG_AKTUAL`NOSTI': '1',
  'DLITEL`NOST`_VVODA': 1,
  'DLITEL`NOST`_SOGLASOVANIYA': 2,
  'DLITEL`NOST`_UTVERZHDENIYA': 3,
  OTCHETNAYA_DATA: null,
  'SDVIG_DATY`_STARTA': '-4',
  NAIMENOVANIE_REGLAMENTA: 'Ежегодно',
  FAKTICHESKOE_KOLICHESTVO_POVTORENIJ: null,
  obj_id: '663577804543809094239698194186580910',
  bo_id: '314157348869574618544551004244061702',
};

const mockFilledReglamentDaily = {
  annualIntervalItem: undefined,
  completionItem: 'runCount',
  constraint: 'interval=1',
  finishDateReglament: null,
  identifikator: '1002430791037564631565087486679161628',
  inputData: 1,
  interval: 1,
  is_actual: '1',
  monthlyIntervalItem: undefined,
  reconciliationData: 1,
  reglamentName: 'Ежедневно',
  rglType: 3,
  runCountValue: 2,
  shiftData: null,
  startDateReglament: '2023-06-15T00:00:00.000',
  validationData: 1,
};

const mockFilledReglamentMouthly = {
  identifikator: '1002430791037564631565087486679161628',
  startDateReglament: '2023-05-31T00:00:00.000',
  finishDateReglament: '2023-06-01T00:00:00.000',
  rglType: 5,
  runCountValue: 1,
  constraint: 'interval=1;day_of_month=1',
  reglamentName: 'Ежемесячно',
  interval: 1,
  dayOfWeek: 'monday',
  monthlyIntervalItem: 'dateOfMonth',
  completionItem: 'runCount',
  weekOfMonth: 1,
  dayOfMonth: 1,
  is_actual: '1',
  inputData: 1,
  reconciliationData: 2,
  validationData: 3,
  shiftData: -4,
  date: 5,
  month: 5,
  monthFromDate: 5,
};

const mockFilledReglamentAnual = {
  identifikator: '1002430791037564631565087486679161628',
  startDateReglament: '2023-05-31T00:00:00.000',
  finishDateReglament: '2023-06-01T00:00:00.000',
  rglType: 6,
  runCountValue: null,
  constraint: 'interval=5;date=5;month=5',
  is_actual: '1',
  inputData: 1,
  reconciliationData: 2,
  validationData: 3,
  shiftData: -4,
  reglamentName: 'Ежегодно',
  interval: 5,
  date: 5,
  month: 5,
  annualIntervalItem: 'annualDateOfMonth',
  completionItem: 'endDate',
  monthFromDate: 5,
};

const mockFilledReglamentAnualWithoutPeriod = {
  identifikator: '1002430791037564631565087486679161628',
  startDateReglament: null,
  finishDateReglament: null,
  rglType: null,
  runCountValue: null,
  constraint: 'interval=1',
  is_actual: '1',
  inputData: 1,
  reconciliationData: 2,
  validationData: 3,
  shiftData: -4,
  reglamentName: null,
  interval: 1,
};
