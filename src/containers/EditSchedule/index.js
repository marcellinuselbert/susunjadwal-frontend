import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "redux/modules/appState";
import {
  Button,
  useColorModeValue,
  Text,
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  Center,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Course from "../BuildSchedule/Course";
import Detail from "../BuildSchedule/Detail";
import Checkout from "../BuildSchedule/Checkout";
import SearchInput from "../BuildSchedule/SearchInput";
import {
  Container,
  InfoContent,
  CoursePickerContainer,
  SelectedCoursesContainer,
} from "../BuildSchedule";

import { setCourses as reduxSetCourses } from "redux/modules/courses";
import { addSchedule, clearSchedule } from "redux/modules/schedules";
import { generateScheduledCourseListFromSchedule } from "./utils";
import SelectedCourses from "containers/SelectedCourses";
import { getSchedule, getCourses } from "services/api";
import { BauhausSide } from "components/Bauhaus";
import { makeAtLeastMs } from "utils/promise";
import FACULTIES from "utils/faculty-base-additional-info.json";
import { useForm } from "react-hook-form";
import { CustomSelect } from "components/CustomSelect";
import searchImg from "assets/Search.svg";
import searchImgDark from "assets/Search-dark.svg";
import arrowImg from "assets/Arrow.svg";
import notFoundImg from "assets/NotFound.svg";
import notFoundDarkImg from "assets/NotFound-dark.svg";

const EditSchedule = ({ match }) => {
  const isAnnouncement = useSelector((state) => state.appState.isAnnouncement);
  const { isMobile } = useSelector((state) => state.appState);
  const auth = useSelector((state) => state.auth);
  const { scheduleId } = useParams();
  const dispatch = useDispatch();
  const theme = useColorModeValue("light", "dark");

  const [courses, setCourses] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isCoursesDetail, setCoursesDetail] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    async function fetchSchedule() {
      dispatch(setLoading(true));
      const {
        data: { user_schedule },
      } = await makeAtLeastMs(getSchedule(match.params.scheduleId), 1000);
      const formattedSchedule = await generateScheduledCourseListFromSchedule(
        auth.majorId,
        user_schedule,
      );
      formattedSchedule.forEach((schd) => {
        dispatch(addSchedule(schd));
      });
      dispatch(setLoading(false));
    }
    if (!!courses) {
      fetchSchedule();
    }
  }, [match, dispatch, courses, auth.majorId]);

  const fetchCourses = useCallback(
    async (majorId) => {
      dispatch(setLoading(true));
      const { data } = await getCourses(majorId);
      setCourses(data.courses);
      setCoursesDetail(data.is_detail);
      setLastUpdated(new Date(data.last_update_at));
      dispatch(reduxSetCourses(data.courses));
      setTimeout(() => dispatch(setLoading(false)), 2000);
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearSchedule());
    const majorId = auth.majorId;
    fetchCourses(majorId);
  }, [auth.majorId, dispatch, fetchCourses]);

  const { register, watch } = useForm();
  const selectedFaculty = watch("fakultas");

  const filteredCourse = courses?.filter((c) => {
    if (value === "") {
      //if value is empty
      return c;
    } else if (c.name.toLowerCase().includes(value.toLowerCase())) {
      //returns filtered array
      return c;
    } else {
      return null;
    }
  });

  return (
    <>
      <BauhausSide />
      <Helmet title="Edit Jadwal" />

      <Container>
        <CoursePickerContainer isMobile={isMobile} mode={theme}>
          <h1>Edit Jadwal</h1>

          {lastUpdated && (
            <h6>
              Jadwal terakhir diperbarui pada {isMobile ? <br /> : " "}
              <span>
                {lastUpdated?.getDate() +
                  "/" +
                  lastUpdated?.getMonth() +
                  "/" +
                  lastUpdated?.getFullYear() +
                  " " +
                  lastUpdated?.toLocaleTimeString()}
              </span>
            </h6>
          )}

          {!isCoursesDetail && (
            <InfoContent mode={theme}>
              <p>
                Uh oh, sepertinya kami belum memiliki jadwal untuk jurusan kamu.
                Silahkan coba untuk melakukan <span>Update Matkul</span> dengan
                menekan tombol di bawah ini!
              </p>
              <Link to="/update">
                <Button mt={{ base: "1rem", lg: "1.5rem" }}>
                  Update Matkul
                </Button>
              </Link>
            </InfoContent>
          )}

          {courses?.length === 0 && (
            <InfoContent mode={theme}>
              <p>
                Uh oh, sepertinya jadwal jurusan kamu belum tersedia. Silahkan
                coba untuk melakukan <span>Update Matkul</span> lagi nanti!
              </p>
              <Link to="/update">
                <Button mt={{ base: "1rem", lg: "1.5rem" }}>
                  Update Matkul
                </Button>
              </Link>
            </InfoContent>
          )}
          <div style={{ position: "relative" }}>
            <InputGroup h={isMobile ? "44px" : "57px"} mb="26px">
              <InputLeftElement
                h="full"
                pl={isMobile ? "14px" : "20px"}
                pointerEvents="none"
                children={
                  <Image
                    alt=""
                    src={theme === "light" ? searchImg : searchImgDark}
                  />
                }
              />
              <SearchInput
                isMobile={isMobile}
                theme={theme}
                courses={courses}
                setValue={setValue}
              />

              <Button
                w="95px"
                h="full"
                borderLeftRadius="0"
                bg={
                  theme === "light" ? "primary.Purple" : "primary.LightPurple"
                }
                onMouseDown={() =>
                  setValue(document.getElementById("input").value)
                }
                fontSize={isMobile && "14px"}
                px={isMobile && "4px"}
                display={isMobile && "none"}
              >
                <Center>
                  Cari
                  <Image alt="" src={arrowImg} ml="9px" />
                </Center>
              </Button>
            </InputGroup>
          </div>
          {filteredCourse &&
            (filteredCourse?.length === 0 ? (
              <Center flexDirection="column" mt="3.5rem">
                <Image
                  alt=""
                  src={theme === "light" ? notFoundImg : notFoundDarkImg}
                />
                <Text
                  mt="20px"
                  color={theme === "light" ? "#33333399" : "#FFFFFF99"}
                >
                  Mata kuliah yang dicari tidak ditemukan
                </Text>
              </Center>
            ) : (
              filteredCourse.map((course, idx) => (
                <Course key={`${course.name}-${idx}`} course={course} />
              ))
            ))}
        </CoursePickerContainer>

        {!isMobile && (
          <SelectedCoursesContainer
            isAnnouncement={isAnnouncement}
            mode={theme}
          >
            <SelectedCourses scheduleId={scheduleId} isEditing />
          </SelectedCoursesContainer>
        )}

        <Checkout
          isMobile={isMobile}
          onClickDetail={(isConflict) =>
            setDetailData({ opened: true, isConflict: isConflict })
          }
        />

        {detailData && detailData.opened && (
          <Detail
            scheduleId={scheduleId}
            isEditing
            closeDetail={() =>
              setDetailData({
                opened: false,
                isConflict: detailData.isConflict,
              })
            }
            isConflict={detailData && detailData.isConflict}
          />
        )}
      </Container>
    </>
  );
};

export default EditSchedule;
