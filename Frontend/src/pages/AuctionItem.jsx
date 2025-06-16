import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20  flex flex-col bg-[#9694FF] min-h-screen">
        <div className="text-[16px] flex flex-wrap gap-2 items-center">
          <Link
            to="/"
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Home
          </Link>
          <FaGreaterThan className="text-[#3D3BF3]" />
          <Link
            to={"/auctions"}
            className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
          >
            Auctions
          </Link>
          <FaGreaterThan className="text-[#3D3BF3]" />
          <p className="text-stone-600">{auctionDetail.title}</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Left Column: Auction Info */}
            <div className="flex-1 flex flex-col gap-3 bg-[#EBEAFF] p-4 rounded-lg shadow-md ">
              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="w-full lg:w-40 lg:h-40 flex justify-center items-center p-5 bg-gray-200 rounded-lg">
                  <img
                    src={auctionDetail.image?.url}
                    alt={auctionDetail.title}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-around pb-4">
                  <h3 className="text-[#3D3BF3] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
                    {auctionDetail.title}
                  </h3>
                  <p className="text-xl text-[#3D3BF3] font-semibold">
                    Condition:{" "}
                    <span className="text-[#FF2929]">
                      {auctionDetail.condition}
                    </span>
                  </p>
                  <p className="text-xl text-[#3D3BF3] font-semibold">
                    Minimum Bid:{" "}
                    <span className="text-[#FF2929]">
                      Rs.{auctionDetail.startingBid}
                    </span>
                  </p>
                </div>
              </div>

              <p className="text-xl text-[#3D3BF3] font-bold">Auction Item Description</p>
              <hr className="my-2 border-t-[1px] border-t-stone-700" />
              {auctionDetail.description &&
                auctionDetail.description.split(". ").map((element, index) => {
                  return (
                    <li key={index} className="text-[18px] my-2">
                      {element}
                    </li>
                  );
                })}
            </div>

            {/* Right Column: Bids */}
            <div className="flex-1 bg-[#EBEAFF]">
              <header className="bg-[#EBEAFF] py-4 text-[24px] font-semibold px-4 rounded-t-lg shadow-md">
                BIDS
              </header>
              <div className="bg-[#EBEAFF] px-4 min-h-fit lg:min-h-[650px] rounded-b-lg shadow-md">
                {auctionBidders &&
                new Date(auctionDetail.startTime) < Date.now() &&
                new Date(auctionDetail.endTime) > Date.now() ? (
                  auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full my-2 hidden md:block"
                            />
                            <p className="text-[18px] font-semibold">
                              {element.userName}
                            </p>
                          </div>
                          {index === 0 ? (
                            <p className="text-[20px] font-semibold text-green-600">
                              1st
                            </p>
                          ) : index === 1 ? (
                            <p className="text-[20px] font-semibold text-blue-600">
                              2nd
                            </p>
                          ) : index === 2 ? (
                            <p className="text-[20px] font-semibold text-yellow-600">
                              3rd
                            </p>
                          ) : (
                            <p className="text-[20px] font-semibold text-gray-600">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No bids for this auction
                    </p>
                  )
                ) : Date.now() < new Date(auctionDetail.startTime) ? (
                  <img
                    src="/notStarted.png"
                    alt="not-started"
                    className="w-full max-h-[650px]"
                  />
                ) : (
                  <img
                    src="/auctionEnded.png"
                    alt="ended"
                    className="w-full max-h-[650px]"
                  />
                )}
              </div>

              {/* Bid Section */}
              <div className="bg-[#FF2929] py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between rounded-lg shadow-md">
                {Date.now() >= new Date(auctionDetail.startTime) &&
                Date.now() <= new Date(auctionDetail.endTime) ? (
                  <>
                    <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                      <p className="text-white">Place Bid</p>
                      <input
                        type="number"
                        className="w-32 focus:outline-none md:text-[20px] p-1 rounded"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <button
                      className="p-4 text-white bg-black rounded-full transition-all duration-300 hover:bg-[#222]"
                      onClick={handleBid}
                    >
                      <RiAuctionFill />
                    </button>
                  </>
                ) : new Date(auctionDetail.startTime) > Date.now() ? (
                  <p className="text-white font-semibold text-xl">
                    Auction has not started yet!
                  </p>
                ) : (
                  <p className="text-white font-semibold text-xl">
                    Auction has ended!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AuctionItem;
