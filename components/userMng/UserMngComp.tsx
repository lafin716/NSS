import { useAxios } from "@/constants/util/API_UTIL";
import { alertAction } from "@/store/modal/alert-slice";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SearchComp from "../comm/searchComp/searchComp";
import UserListTable from "./UserListTable";

const UserMngComp = () => {
  const [usrList, setUsrList] = useState<any>(null);
  const [domLoaded, setDomLoaded] = useState(false); // 테이블 데이터 로딩 상태
  const [isSearchNm, setIsSearchNm] = useState(false);
  const [isGetInitData, setIsGetInitData] = useState(false);

  const router = useRouter();
  const { code, response, fetchData } = useAxios();
  const dispatch = useDispatch();

  useEffect(() => {
    getResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, response, router]);

  const getResult = useCallback(() => {
    // console.log(`code :: ${code} / response :: `, response);
    if (isGetInitData) {
      setIsGetInitData(false);

      if (response && code == "200") {
        // console.log(response);
        const tmpObject = response;
        const tmpList: { [s: string]: any } = [];
        // object 형으로 받아와서 배열 형태로 변환해주기
        let i = 0;
        for (const [key, value] of Object.entries(tmpObject)) {
          tmpList[i] = value;
          i++;
        }
        setUsrList(
          tmpList.length > 0
            ? tmpList
            : [
                {
                  userId: "memId_00000000000001",
                  username: "김이름",
                  userStatus: "ACTIVE",
                  // user_image: "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg",
                },
                {
                  userId: "memId_00000000000002",
                  username: "김이름1",
                  userStatus: "ADMIN",
                  // user_image: "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg",
                },
                {
                  userId: "memId_00000000000003",
                  username: "김이름2",
                  userStatus: "INACTIVE",
                  // user_image: "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg",
                },
                {
                  userId: "memId_00000000000004",
                  username: "김이름3",
                  userStatus: "REMOVED",
                  // user_image: "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg",
                },
                {
                  userId: "memId_00000000000005",
                  username: "김이름4",
                  userStatus: "BANNED",
                  // user_image: "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg",
                },
              ]
        );
        setIngredientCnt(tmpList.length);
        setDomLoaded(true);
      }
    }

    if (isSearchNm) {
      setIsSearchNm(false);
      if (response && code == "200") {
        console.log(response);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, response]);

  /**
   * 최초 회원 리스트 조회
   */
  useEffect(() => {
    setIsGetInitData(true);
    fetchData("get", "/api/userMng/getUserList", null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 회원명으로 검색 통신
   * @param searchNm 검색할 회원명
   * @returns
   */
  const searchItemBtnHandler = (searchNm: string) => {
    if (searchNm?.length <= 0) {
      dispatch(alertAction.openModal({ cont: "조회할 사용자 이름을 입력하세요." }));
      return false;
    } else {
      setIsSearchNm(true);
    }
    let data = { username: searchNm };
    fetchData("post", "/api/userMng/searchUsername", data, true);
  };

  const [nowTablePage, setNowTablePage] = useState(1);
  const [ingredientCnt, setIngredientCnt] = useState(0);

  /**
   * 페이징 처리
   * @returns
   */
  const drawTablePage = () => {
    let tmpArray = [];
    let pageRange = Math.ceil(ingredientCnt / 5);
    for (let index = 1; index <= pageRange; index++) {
      if (index === nowTablePage) {
        // 현재 보고있는 페이지면 css 다르게
        tmpArray.push(
          <strong className="num" onClick={() => clickOtherPageHandler(index)}>
            {index}
          </strong>
        );
      } else {
        tmpArray.push(
          <div className="num" onClick={() => clickOtherPageHandler(index)}>
            {index}
          </div>
        );
      }
    }
    return tmpArray;
  };
  const clickOtherPageHandler = (clickedPage: number) => {
    setNowTablePage(clickedPage);
  };

  return (
    <>
      <div className="mainComponent">
        <h1>회원관리</h1>
        {/* <div className="w-[405px] h-[800px] relative overflow-hidden bg-white mx-auto my-0"> */}
        <SearchComp searchItemBtnHandler={searchItemBtnHandler} />
        <div className="m-auto">
          {
            domLoaded && <UserListTable usrList={usrList} nowTablePage={nowTablePage} />
            // (!!usrList ? (
            //   usrList.map((usr: any, index: number) => {
            //     return (
            //       <div key={String(usr.userId)}>
            //         <div className="w-[400px] usrListGrp py-3 mx-auto my-0">
            //           <div className="flex">
            //             <div className="relative h-[50px] w-[50px] rounded-full overflow-hidden">
            //               <Image src={usr.user_image || "https://cdn2.hubspot.net/hubfs/53/image8-2.jpg"} alt={"usrImg"} layout="fill"></Image>
            //             </div>
            //             <div className="text-base	text-center px-3 py-3 cursor-pointer	" onClick={() => goUsrMng(usr.userId)}>
            //               {usr.username}
            //             </div>
            //           </div>
            //           <div className="text-[#00c1a6] font-bold	px-3 py-3">{codeToKor(usr.userStatus)}</div>
            //         </div>
            //       </div>
            //     );
            //   })
            // ) : (
            //   <div>목록을 불러올 수 없습니다.</div>
            // ))
          }
        </div>
        {/* ======= paging ======= */}
        <div className="paging">
          <div className="first" onClick={() => clickOtherPageHandler(1)}>
            <span className="hidden">처음페이지</span>
          </div>
          <div className="prev" onClick={() => clickOtherPageHandler(nowTablePage - 1 < 1 ? 1 : nowTablePage - 1)}>
            <span className="hidden">이전페이지</span>
          </div>
          {drawTablePage()}
          <div className="next" onClick={() => clickOtherPageHandler(nowTablePage + 1 > Math.ceil(ingredientCnt / 5) ? Math.ceil(ingredientCnt / 5) : nowTablePage + 1)}>
            <span className="hidden">다음페이지</span>
          </div>
          <div className="last" onClick={() => clickOtherPageHandler(Math.ceil(ingredientCnt / 5))}>
            <span className="hidden">마지막페이지</span>
          </div>
        </div>
        {/* ======= paging ======= */}
        {/* </div> */}
      </div>
    </>
  );
};

export default UserMngComp;
