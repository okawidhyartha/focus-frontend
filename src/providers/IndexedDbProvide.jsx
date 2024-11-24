import { initDB } from "react-indexed-db-hook";
import PropTypes from "prop-types";

const DBConfig = {
  name: "FocusSphereDB",
  version: 3,
  objectStoresMeta: [
    {
      store: "tasks",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        {
          name: "username",
          keypath: "username",
          options: { unique: false },
        },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        {
          name: "estCycle",
          keypath: "estCycle",
          options: { unique: false },
        },
        {
          name: "actCycle",
          keypath: "actCycle",
          options: { unique: false },
        },
        {
          name: "done",
          keypath: "done",
          options: { unique: false },
        },
      ],
    },
    {
      store: "tasksSyncUpdate",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        {
          name: "username",
          keypath: "username",
          options: { unique: false },
        },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        {
          name: "estCycle",
          keypath: "estCycle",
          options: { unique: false },
        },
        {
          name: "actCycle",
          keypath: "actCycle",
          options: { unique: false },
        },
        {
          name: "done",
          keypath: "done",
          options: { unique: false },
        },
      ],
    },
    {
      store: "tasksSyncDelete",
      storeConfig: { keyPath: "id" },
      storeSchema: [
        {
          name: "username",
          keypath: "username",
          options: { unique: false },
        },
      ],
    },
    {
      store: "settings",
      storeConfig: { keyPath: "username" },
      storeSchema: [
        {
          name: "focusTime",
          keypath: "focusTime",
          options: { unique: false },
        },
        {
          name: "shortBreak",
          keypath: "shortBreak",
          options: { unique: false },
        },
        {
          name: "longBreak",
          keypath: "longBreak",
          options: { unique: false },
        },
        {
          name: "focusMusic",
          keypath: "focusMusic",
          options: { unique: false },
        },
        {
          name: "alarm",
          keypath: "alarm",
          options: { unique: false },
        },
      ],
    },
    {
      store: "settingsSyncUpdate",
      storeConfig: { keyPath: "username" },
      storeSchema: [
        {
          name: "focusTime",
          keypath: "focusTime",
          options: { unique: false },
        },
        {
          name: "shortBreak",
          keypath: "shortBreak",
          options: { unique: false },
        },
        {
          name: "longBreak",
          keypath: "longBreak",
          options: { unique: false },
        },
        {
          name: "focusMusic",
          keypath: "focusMusic",
          options: { unique: false },
        },
        {
          name: "alarm",
          keypath: "alarm",
          options: { unique: false },
        },
      ],
    },
  ],
};

initDB(DBConfig);

const IndexedDbProvider = ({ children }) => {
  return children;
};

export default IndexedDbProvider;

IndexedDbProvider.propTypes = {
  children: PropTypes.node,
};
