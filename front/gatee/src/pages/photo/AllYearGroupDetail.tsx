import React, {useEffect} from 'react';
import PhotoList from "@components/PhotoList";
import {useOutletContext, useParams} from "react-router-dom";
import {photoGroup} from "@constants/index";
import {PhotoOutletInfoContext} from "@type/index";
import {useFamilyStore} from "@store/useFamilyStore";
import {getAlbumDetailApi, getListPhotoApi} from "@api/photo";

interface RouteParams {
  [key: string]: string | undefined;
}

const PhotoAllYearGroupDetail = () => {
  const {editMode, handleChecked} = useOutletContext<PhotoOutletInfoContext>();
  const {familyId} = useFamilyStore()
  const params = useParams<RouteParams>()

  useEffect(() => {
    // params에서 년 뽑아서 API 호출
    if (params.year) { // Check if params.year is defined
      const payload = {
        familyId: familyId,
        filter: "YEAR",
        year: params.year,
        month: null
      };
      getListPhotoApi(
        payload,
        res => {
          console.log(res)
        }, err => {
          console.log(err)
        }
      );
    }
  }, [params.year]); // Include params.year in the dependency array

  return (
    <div>
      <div className="detail-tab--title">
        {params.year}년
      </div>
      <PhotoList editMode={editMode} photoGroup={photoGroup} handleChecked={handleChecked}/>
    </div>
  );
}

export default PhotoAllYearGroupDetail;