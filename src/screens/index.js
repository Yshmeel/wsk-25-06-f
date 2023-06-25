import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AppContext from "../app.context"
import ContentWrapper from "../components/content-wrapper"

const IndexScreen = () => {
    const context = useContext(AppContext);

    if(context.authorized) {
        return (
            <ContentWrapper>
                <section className={'main'}>
                    <div className="main__content">
                        Content area. Nothing to see here
                    </div>

                    <div className="main__interaction">
                        <Link to={'/courses'}>Courses</Link>
                        <Link to={'/my-courses'}>My courses</Link>
                    </div>
                </section>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            <section className={'main'}>
                <div className="main__content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras purus mauris, lobortis ac libero vel, venenatis malesuada neque.
                    Morbi tincidunt tortor eget ligula luctus venenatis. Mauris pharetra ex in urna gravida interdum. Cras diam tortor, fringilla sed
                    convallis ac, semper et tellus. Mauris volutpat a enim id vestibulum. Nam non velit luctus, accumsan magna non, pretium libero.
                    Morbi porta convallis sem, vitae placerat turpis iaculis ut. Morbi pulvinar pretium tincidunt. Cras a blandit turpis.
                    Suspendisse pretium tincidunt eros euismod facilisis.
                </div>

                <div className="main__interaction">
                    <Link to={'/login'}>Login</Link>
                    <Link to={'/signup'}>Sign up</Link>
                </div>
            </section>
        </ContentWrapper>
    )
};

export default IndexScreen;
