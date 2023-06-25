import React, {useEffect, useMemo, useRef, useState} from 'react'
import {courses, rateCourse, registration, registrations as registrationsApi} from "../api"
import ContentWrapper from "../components/content-wrapper"

const MyCoursesScreen = () => {
    const [data, setData] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');

    const rRef = useRef(null);

    const load = async () => {
        setLoading(true);

        try {
            const response = await courses();
            const rResponse = await registrationsApi();
            setData(response.data);
            setRegistrations(rResponse.data);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // create ical file with real data and download it
    const downloadiCal = (c) => () => {
        let icalFile = `
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//ical.marudot.com//iCal Event Maker
        X-WR-CALNAME:Invitation: ${c.title}
        CALSCALE:GREGORIAN
        BEGIN:VTIMEZONE
        TZID:Europe/Moscow
        TZURL:http://tzurl.org/zoneinfo-outlook/Europe/Moscow
        X-LIC-LOCATION:Europe/Moscow
        BEGIN:STANDARD
        TZOFFSETFROM:+0300
        TZOFFSETTO:+0300
        TZNAME:MSK
        DTSTART:19700101T000000
        END:STANDARD
        END:VTIMEZONE
        BEGIN:VEVENT
        DTSTAMP:20190628T131353Z
        UID:20190628T131353Z-669183810@marudot.com
        DTSTART;VALUE=DATE:${c.date_time.split(" ")[0].replace("-", "")}
        DTEND;VALUE=DATE:${c.date_time.split(" ")[0].replace("-", "")}
        SUMMARY:${c.title}
        URL:https%3A%2F%2Fcstclub.ru
        DESCRIPTION:\\\Instructor: ${c.instructor_name}
        LOCATION:${c.location}
        END:VEVENT
        END:VCALENDAR
        `;

        // create empty A tag with download attr. that allows to perform click on page and download file
        const  element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(icalFile));
        element.setAttribute('download', 'event.ical');

        // we aint need to show element on page, but it stays clickable
        element.style.display = 'none';
        document.body.appendChild(element);

        // download
        element.click();

        // delete dummy element from ODM
        document.body.removeChild(element);
    };

    // shows alert and deletes it after 1500ms
    const showAlert = (text) => {
        setAlertMessage(text);

        rRef.current = setTimeout(() => {
            setAlertMessage('');
        }, 1500);
    };

    // rate course on change select, and reload whole page. show alert on success
    const handleChangeRating = (course) => async (ev) => {
        try {
            await rateCourse(course.id, ev.target.value);
            load();

            showAlert('Rating success');
        } catch(e) {
            console.error(e);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const renderedCourses = useMemo(() => {
        if(loading) {
            return (
                <span>Loading...</span>
            );
        }

        return data.map((c) => {
            const registered = registrations.find((v) => v.course_id === c.id);

            if(!registered) {
                return null;
            }

            return (
                <div className={'my-courses-list__item'}  key={`my-course-${c.id}`}>
                    <div className="my-courses-list__item--td medium-block">
                        {c.title}
                    </div>

                    <div className="my-courses-list__item--td small-block">
                        {c.date_time.split(" ")[0]}
                    </div>

                    <div className="my-courses-list__item--td small-block">
                        <button type={"button"} onClick={downloadiCal(c)}>
                            Download
                        </button>
                    </div>

                    <div className="my-courses-list__item--td big-block">
                        <select value={registered.rate} onChange={handleChangeRating(c)}>
                            <option value={0}>Bad</option>
                            <option value={1}>Good</option>
                            <option value={2}>Excellent</option>
                        </select>
                    </div>
                </div>
            )
        }).filter((v) => v);
    }, [loading, data, registrations]);

    return (
        <ContentWrapper>
            <section className={'my-courses'}>
                <div className="my-courses-list">
                    <div className="my-courses-header">
                        <h1>My courses</h1>
                    </div>

                    {alertMessage && (
                        <div className="my-courses-alert">
                            {alertMessage}
                        </div>
                    )}

                    <div className="my-courses-list">
                        <div className="my-courses-list__header">
                            <div className="my-courses-list__header--item medium-block">
                                Course name
                            </div>

                            <div className="my-courses-list__header--item small-block">
                                Date
                            </div>

                            <div className="my-courses-list__header--item small-block">
                                iCal
                            </div>

                            <div className="my-courses-list__header--item big-block">
                                Rating
                            </div>
                        </div>

                        <div className="my-courses-list__items">
                            {renderedCourses}
                        </div>
                    </div>
                </div>
            </section>
        </ContentWrapper>
    )
};

export default MyCoursesScreen;
