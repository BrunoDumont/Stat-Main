import React from "react";
import Select from 'react-select';

type SelectableButtonTypes = 'primary' | 'secondary' | 'modal'

interface ISelectorProps {
  type: SelectableButtonTypes
  value: any,
  onChange: (e?: any) => void
  className?: string,
  isMulti?: boolean
  options: any
  isLoading?: boolean
  isOptionDisabled?: (arg0: any) => boolean
}

const primaryStyles = {
  control: (styles: any) => ({...styles, backgroundColor: 'white', height: "100%"}),
  option: (styles: any, {data, isDisabled, isSelected}: any) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? data.color
          : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? 'black'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? data.color : null),
      },
    };
  },
  placeholder: () => {
    return ({marginLeft: '2px', marginRight: '2px', position: 'relative', color: 'black'})
  },
  singleValue: () => {
    return ({marginLeft: '2px', marginRight: '2px', position: 'relative', color: 'black'})
  },
};

const secondaryStyles = {
  control: (styles: any) => ({
    ...styles,
    color: 'white',
    backgroundColor: '#B4B4BF',
    height: "100%",
    borderColor: null,
    boxShadow: null,
    "&:hover": {
      borderColor: null
    }
  }),
  menu: (styles: any) => {
    return {
      ...styles,
      width: 'auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  },
  option: (styles: any, {isDisabled, isSelected}: any) => {
    let color = 'black'
    let backgroundColor = 'white'
    if (isDisabled) color = '#ccc'
    if (isSelected) color = '#E0BB87'
    return {
      ...styles,
      backgroundColor,
      color,
      padding: '4px 12px',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
      },
    };
  },
  placeholder: () => {
    return ({marginLeft: '2px', marginRight: '2px', position: 'relative', color: 'white'})
  },
  singleValue: () => ({
    marginLeft: '2px',
    marginRight: '2px',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  input: (styles: any) => {
    return {...styles, position: 'absolute',caretColor: 'rgba(0,0,0,0)', cursor: 'default', color: 'white'}
  }
};

const modalStyles = {
  control: (styles: any) => {
    return {
      ...styles,
      borderColor: null,
      boxShadow: null,
      ':hover': {
        ...styles[':hover'],
        borderColor: '#E0BB87',
      }
    }
  },
  option: (styles: any, {data, isDisabled, isSelected}: any) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? data.color
          : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
          ? '#E0BB87'
          : 'data.color',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? '#E0BB87' : null),
      },
    };
  },
  placeholder: () => {
    return ({marginLeft: '2px', marginRight: '2px', position: 'relative'})
  },
  singleValue: () => {
    return ({
      marginLeft: '2px',
      marginRight: '2px',
      position: 'relative',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    })
  },
  multiValue: (base: any, state: any) => {
    return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
  },
  multiValueLabel: (base: any, state: any) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base: any, state: any) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  },
  input: (styles: any) => {
    return {...styles, caretColor: 'rgba(0,0,0,0)', cursor: 'none', color: 'black'}
  }
};

export const Selector: React.FC<ISelectorProps> = ({
                                                     type,
                                                     isMulti = false,
                                                     value,
                                                     onChange,
                                                     options,
                                                     isLoading = false,
                                                     isOptionDisabled
                                                   }) => {
  let style: {} = primaryStyles

  if (type === 'secondary') style = secondaryStyles
  else if (type === 'modal') style = modalStyles

  return (
    <Select
      isMulti={isMulti}
      onChange={onChange}
      value={value}
      options={options}
      isLoading={isLoading}
      isOptionDisabled={isOptionDisabled}
      getOptionValue={option => option.value}
      styles={style}
      menuPlacement="auto"
      placeholder="Выберите..."
    />
  )
}