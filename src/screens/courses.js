import React, {useEffect, useMemo, useRef, useState} from 'react'
import {courses, registration, registrations as registrationsApi} from "../api"
import ContentWrapper from "../components/content-wrapper"

const CoursesScreen = () => {
    const [data, setData] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [datetime, setDatetime] = useState('');

    const [alertMessage, setAlertMessage] = useState('');
    const rRef = useRef(null);

    // load courses and registrations api
    // api does not support bulk fetch data, so we need to collect them on frontend to output
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

    // registers on backend, reload whole page and show alert
    const handleRegister = (id) => async () => {
        try {
            await registration(id);
            load();

            showAlert('Register for the course was successful');
        } catch(e) {
            console.error(e);
        }
    };

    const onChangeDatetime = (ev) => {
        setDatetime(ev.target.value);
    };

    // shows alert and disappears from page after 1500s
    const showAlert = (text) => {
        setAlertMessage(text);

        rRef.current = setTimeout(() => {
            setAlertMessage('');
        }, 1500);
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

        const dt = new Date(datetime);

        return data.filter((v) => {
            // filter of courses. if we didn't input datetime, so we skip the filtration
            // or check between two unix-dates, and check their days to be relative -1
            // may have some bugs in difference between days, if date stays on the end of month
           if(!datetime) {
               return true;
           }

           const dd = new Date(v.date_time);
           return dd.getTime() >= dt.getTime() && (dd.getDay() - dt.getDay()) <= 2;
        }).map((c) => {
            const registered = registrations.find((v) => v.course_id === c.id);

            return (
                <div className={'course-card'} key={`course-${c.id}`}>
                    <div className="course-card__title">
                        <b>{c.title}</b>
                        <span>{c.date_time} @ {c.location}</span>
                        <span>Available seats: {c.seats - (registered ? 1 : 0)}</span>
                    </div>

                    <div className="course-card__meta">
                        <span><b>Instructor: </b> {c.instructor_name}</span>
                    </div>

                    <div className="course-card__description">
                        {c.description}
                    </div>

                    <div className="course-card__button">
                        <button type={'button'} disabled={!!registered} onClick={handleRegister(c.id)}>
                            {registered ? 'Registered' : 'Register'}
                        </button>
                    </div>
                </div>
            )
        });
    }, [loading, data, registrations, handleRegister]);

    return (
        <ContentWrapper>
            <section className={'courses'}>
                <div className="courses-header">
                    <h1>Upcoming courses</h1>

                    <div className="courses-header__filter">
                        <label htmlFor="date_time">Filter by start date</label>
                        <input type="date" id={'date_time'} value={datetime} onChange={onChangeDatetime}/>
                    </div>
                </div>

                {alertMessage && (
                    <div className="courses-alert">
                        {alertMessage}
                    </div>
                )}

                <div className="courses-list">
                    {renderedCourses}
                </div>
            </section>
        </ContentWrapper>
    )
};

export default CoursesScreen;
