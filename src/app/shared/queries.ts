import { StatusStatus } from './';
import gql from 'graphql-tag';

const getAllNodes = gql`
  query getAllNodes {
    nodes: allClusterNodes {
      id
      name
      localIp
      cores
      memory
      location
      statuses {
        id
        status
        clusternode {
          id
        }
        service {
          id
          name
        }
      }
      tags {
        id
        name
        colornumber
      }
    }
  }
`;

const getallServices = gql`
  query getAllServices {
    sevices: allServices {
      id
      name
      statuses {
        id
        status
        clusternode {
          id
          name
          localIp
          cores
          memory
          location
          tags {
            id
            name
            colornumber
          }
        }
      }
    }
  }
`;

const getAllTags = gql`
  query getAllTags {
    tags: allTags {
      id
      colornumber
      name
    }
  }
`;

const getAllStatus = gql`
  query getAllStatus {
    status: allStatuses {
      id
      status
    }
  }
`;

const createStatus = gql`
  mutation createStatus($nodeId: ID!, $serviceId: ID!) {
    createStatus(
      status: STOPPED,
      clusternodeId: $nodeId,
      serviceId: $serviceId) {

      id
    }
  }
`;
createStatus.variables = (nodeId: String, serviceId: String): any => ({nodeId, serviceId});

const updateStatus = gql`
  mutation updateStatus($statusId: ID!, $status: STATUS_STATUS!) {
    updateStatus(
      id: $statusId,
      status: $status) {

      id,
      status
    }
  }
`;
updateStatus.variables = (statusId: String, status: String): any => ({statusId, status});

export const queries = {
  getAllNodes,
  getallServices,
  getAllTags,
  getAllStatus,
  createStatus,
  updateStatus,
};
