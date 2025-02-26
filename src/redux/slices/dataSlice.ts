import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseApi } from '../../middleware/api';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await courseApi.getCourses();
    return response.data.data;
  }
);

export const fetchCourse = createAsyncThunk(
  'modules/fetchCourse',
  async (courseId) => {
    const response = await courseApi.getCourseById(courseId);
    return response.data.data;
  }
);
export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async () => {
    const response = await courseApi.getAllModules();
    return response.data.data;
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ courseId, courseData }) => {
    const response = await courseApi.updateCourse(courseId, courseData);
    return response.data.data;
  }
);

export const fetchSubmoduleDetails = createAsyncThunk(
  'modules/fetchSubmoduleDetails',
  async (submoduleId) => {
    const response = await courseApi.fetchSubmoduleDetails(submoduleId);
    return response.data.data;
  }
);

export const updateSubmodule = createAsyncThunk(
  'courses/updateSubmodule',
  async ({ submoduleId, submoduleData }) => {
    const response = await courseApi.updateSubmodule(submoduleId, submoduleData);
    return response.data.data;
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enrollInCourse',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await courseApi.enrollCourse(formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to enroll in course');
    }
  }
);


const dataSlice = createSlice({
  name: 'admin',
  initialState: {
    courses: [],
    modules: [],
    submodules: [],
    currentSubmodule: null,
    course: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.course = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(course => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      // Fetch Modules
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.modules = action.payload;
      })
      .addCase(fetchSubmoduleDetails.fulfilled, (state, action) => {
        state.currentSubmodule = action.payload;
        state.loading = false;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        const enrolledCourse = action.payload;
        const courseIndex = state.courses.findIndex(c => c._id === enrolledCourse._id);
        if (courseIndex !== -1) {
          state.courses[courseIndex] = {
            ...state.courses[courseIndex],
            isEnrolled: true
          };
        }
      })
      // Generic error handling for all actions
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      )
      .addMatcher(
        action => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      );
  },
});

export const { clearError } = dataSlice.actions;
export default dataSlice.reducer;